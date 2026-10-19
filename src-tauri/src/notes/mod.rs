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

#[tauri::command]
pub fn add_note(title: String, category_id: i32) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO notes (title, category_id) VALUES (?, ?, ?)",
        params![title, category_id],
    )
    .map_err(|e| e.to_string())?;
    println!("Note added");
    Ok(())
}

#[derive(Serialize)]
pub struct Note {
    id: i32,
    title: String,

    category_id: i32,
    created_at: String,
    updated_at: String,
}

#[tauri::command]
pub fn get_all_notes() -> Result<Vec<Note>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, title, category_id, created_at, updated_at FROM notes")
        .map_err(|e| e.to_string())?;
    let notes_iter = stmt
        .query_map([], |row| {
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                category_id: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes = Vec::new();
    for note in notes_iter {
        notes.push(note.map_err(|e| e.to_string())?);
    }
    Ok(notes)
}

// #[tauri::command]
// pub fn update_note(
//     title: String,
//     content: String,
//     category_id: i32,
//     note_id: i32,
// ) -> Result<usize, String> {
//     let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
//     let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
//     let changes = conn.execute(
//             "UPDATE notes SET title = ?, content = ?, category_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
//             params![title, content, category_id, note_id],
//         ).map_err(|e| e.to_string())?;
//     Ok(changes)
// }

#[tauri::command]
pub fn delete_note(note_id: i32) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute("DELETE FROM notes WHERE id = ?", params![note_id])
        .map_err(|e| e.to_string())?;
    Ok(changes)
}
#[tauri::command]
pub fn get_noteByID(note_id: i32) -> Result<Vec<Note>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT id, title, content, category_id, created_at, updated_at FROM notes WHERE id = ?") // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![note_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                category_id: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes = Vec::new();
    for note_result in notes_iter {
        // Переименовано note в note_result. Важно обрабатывать Result из итератора
        match note_result {
            Ok(note) => notes.push(note),
            Err(e) => return Err(e.to_string()), // Важно! Обработка ошибок при итерации
        }
    }
    Ok(notes)
}
#[tauri::command]
pub  fn get_all_notesByCategory_id(category_id: i32)-> Result<Vec<Note>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT id, title, content, category_id, created_at, updated_at FROM notes WHERE category_id = ?")   // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![category_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                category_id: row.get(2)?,
                created_at: row.get(3)?,
                updated_at: row.get(4)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut notes = Vec::new();
    for note_result in notes_iter {
        // Переименовано note в note_result. Важно обрабатывать Result из итератора
        match note_result {
            Ok(note) => notes.push(note),
            Err(e) => return Err(e.to_string()), // Важно! Обработка ошибок при итерации
        }
    }
    Ok(notes)
}

#[tauri::command]
pub fn update_grub_notes___by_grub_id(
    category_id: i32,
    note_id: i32,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn.execute(
          "UPDATE notes SET category_id =?  WHERE id = ?",
            params![ category_id, note_id  ],
        ).map_err(|e| e.to_string())?;
    Ok(changes)
}