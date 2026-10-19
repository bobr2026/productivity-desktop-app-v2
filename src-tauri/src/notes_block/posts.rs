use std::path::PathBuf;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use dirs_next::home_dir;
use rusqlite::{params, Connection, Result};
use serde::Serialize;

use std::fs;

fn get_db_path() -> Option<PathBuf> {
    // Получаем домашний каталог
    let home = home_dir()?;

    // Создаем путь к папке "Admin-app"
    let mut dir_path = home.clone();
    dir_path.push("Admin-app");
    
    // Создаем папку, если ее нет
    // Обработка ошибок: если не удалось создать, возвращаем None или обработать иначе
    if let Err(e) = fs::create_dir_all(&dir_path) {
        eprintln!("Ошибка при создании папки: {}", e);
        return None;
    }
    
    // Добавляем название файла базы данных
    dir_path.push("my_db.db");
    
    Some(dir_path)
}

#[derive(Serialize)]
pub struct Post {
    post_id: i32,
    text_title: String,
    text_content: String,
    position_in_the_note: i32,
   
}
struct post_notes{
    post_id:i32,
    note_id:i32
}

#[tauri::command]
pub fn add_post_in_note(
    text_title: String,
    text_content: String,
    position_in_the_note: i32,
    note_id: i32
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Вставляем новый пост
    conn.execute(
        "INSERT INTO posts (text_title, text_content, position_in_the_note) VALUES (?, ?, ?)",
        params![text_title, text_content, position_in_the_note],
    ).map_err(|e| e.to_string())?;

    // Получаем ID только что вставленного поста
    let post_id = conn.last_insert_rowid();

    // Связываем пост с заметкой
    conn.execute(
        "INSERT INTO post_notes (note_id, post_id) VALUES (?, ?)",
        params![note_id, post_id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn add_file_in_post(
    file_type: String,
    file_path: String,
    file_id: i32,
    post_id: i32
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Вставляем файл
    conn.execute(
        "INSERT INTO files (file_type, file_path) VALUES (?, ?)",
        params![file_type, file_path],
    ).map_err(|e| e.to_string())?;

    // Получаем id файла, если оно не было передано или нужно протестировать корректность
    // В вашем случае, кажется, вы передаете file_id как параметр, так что пропустите это.
    // Однако, если нужно получить последний, используйте `last_insert_rowid()`

    // Связываем файл и пост
    conn.execute(
        "INSERT INTO file_posts (file_id, post_id) VALUES (?, ?)",
        params![file_id, post_id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}
#[tauri::command]
pub fn get_all_post_by_note_id(note_id: i32) -> Result<Vec<Post>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Используйте JOIN чтобы сразу получить посты по ID заметки
    let mut stmt = conn.prepare(
        "SELECT p.post_id, p.text_title, p.text_content, p.position_in_the_note
        FROM posts AS p
        JOIN post_notes AS pn ON p.post_id = pn.post_id
        WHERE pn.note_id = ?"
    ).map_err(|e| e.to_string())?;

    let posts_iter = stmt.query_map(params![note_id], |row| {
        Ok(Post {
            post_id: row.get(0)?,
            text_title: row.get(1)?,
            text_content: row.get(2)?,
            position_in_the_note: row.get(3)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut posts = Vec::new();
    for post_result in posts_iter {
        posts.push(post_result?);
    }

    Ok(posts)
}

#[tauri::command]
pub fn remove_post_from_note(post_id: i32, note_id: i32) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Удаляем связь поста и заметки
    conn.execute(
        "DELETE FROM post_notes WHERE post_id = ? AND note_id = ?",
        params![post_id, note_id],
    ).map_err(|e| e.to_string())?;

    // Проверяем, остались ли связи этого поста с заметками
    let count_notes: i32 = conn.query_row(
        "SELECT COUNT(*) FROM post_notes WHERE post_id = ?",
        params![post_id],
        |row| row.get(0),
    ).unwrap_or(0);

    // Если у поста больше нет связей с заметками, удаляем сам пост
    if count_notes == 0 {
        // Перед удалением можно выбрать все связанные файлы
        let file_ids: Vec<i32> = conn.prepare(
            "SELECT file_id FROM file_posts WHERE post_id = ?"
        ).and_then(|mut stmt| {
            let mut rows = stmt.query_map(params![post_id], |row| row.get(0))?;
            rows.collect::<Result<Vec<i32>, _>>()
        }).unwrap_or_else(|_| Vec::new());

        // Удаляем связи файлов и поста
        conn.execute(
            "DELETE FROM file_posts WHERE post_id = ?",
            params![post_id],
        ).map_err(|e| e.to_string())?;

        // Удаляем сам пост
        conn.execute(
            "DELETE FROM posts WHERE post_id = ?",
            params![post_id],
        ).map_err(|e| e.to_string())?;

        // Проверка: если файлы больше не связаны с другими постами, удаляем файлы
        for file_id in file_ids {
            let count: i32 = conn.query_row(
                "SELECT COUNT(*) FROM file_posts WHERE file_id = ?",
                params![file_id],
                |row| row.get(0),
            ).unwrap_or(0);
            if count == 0 {
                conn.execute(
                    "DELETE FROM files WHERE file_id = ?",
                    params![file_id],
                ).map_err(|e| e.to_string())?;
            }
        }
    }

    Ok(())
}

#[tauri::command]
pub fn remove_file_from_post(file_id: i32, post_id: i32) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Удаляем связь файла и поста
    conn.execute(
        "DELETE FROM file_posts WHERE file_id = ? AND post_id = ?",
        params![file_id, post_id],
    ).map_err(|e| e.to_string())?;

    // Проверяем, есть ли еще связи этого файла
    let count: i32 = conn.query_row(
        "SELECT COUNT(*) FROM file_posts WHERE file_id = ?",
        params![file_id],
        |row| row.get(0),
    ).unwrap_or(0);

    // Если связи больше нет, удаляем файл
    if count == 0 {
        conn.execute(
            "DELETE FROM files WHERE file_id = ?",
            params![file_id],
        ).map_err(|e| e.to_string())?;
    }

    Ok(())
}