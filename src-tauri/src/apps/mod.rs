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
pub fn add_app(
    title: String,
    path: String,
    hotkey: String,
    app_grub_id: i32,
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO apps ( title,path,  hotkey,  app_grub_id) VALUES 
            (?, ?, ?, ? )",
        params![ title,path, hotkey,app_grub_id  ],
    )
    .map_err(|e| e.to_string())?;
    println!("app added");
    Ok(())
}

// CREATE TABLE IF NOT EXISTS apps (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     title TEXT NOT NULL,
//     path TEXT NOT NULL,
//     hotkey TEXT,
//     app_grub_id INTEGER,
//     FOREIGN KEY (app_grub_id) REFERENCES apps_grub(id)
#[derive(Serialize)]

pub struct App {
    id: i32,
    title: String,
    path: String,
    hotkey: String,
    app_grub_id: i32,
}

#[tauri::command]
pub fn get_all_apps() -> Result<Vec<App>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, title,path,  hotkey,  app_grub_id FROM apps")
        .map_err(|e| e.to_string())?;
    let folders_iter = stmt
        .query_map([], |row| {
            Ok(App {
                id: row.get(0)?,
                title: row.get(1)?,
                path: row.get(2)?,
                hotkey: row.get(3)?,
                app_grub_id: row.get(4)?,
          
            })
        })
        .map_err(|e| e.to_string())?;

    let mut folders = Vec::new();
    for folder in folders_iter {
        folders.push(folder.map_err(|e| e.to_string())?);
    }
    Ok(folders)
}
// let mut notes = Vec::new();
//     for note in notes_iter {
//         notes.push(note.map_err(|e| e.to_string())?);
//     }
//     Ok(notes)
// }

//icon_id,path, hotkey , folder_grub_id,folder_id)
#[tauri::command]
pub fn update_app(
    title: String,
    path: String,
    hotkey: String,
    app_grub_id: i32,
    app_id: i32,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn.execute(
          "UPDATE folders SET title = ?, path = ?, hotkey = ? app_grub_id= ?  WHERE id = ?",
            params![title, path, hotkey, app_grub_id, app_id ],
        ).map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn delete_app(app_id: i32) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute("DELETE FROM apps WHERE id = ?", params![app_id])
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn get_appsByID(app_id: i32) -> Result<Vec<App>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT id, title,path,  hotkey,  app_grub_id FROM apps WHERE id = ?") // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![app_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(App {
                id: row.get(0)?,
                title: row.get(1)?,
                path: row.get(2)?,
                hotkey: row.get(3)?,
                app_grub_id: row.get(4)?,
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
pub  fn get_all_appsByGrub_id(grub_id: i32)-> Result<Vec<App>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT id, title,path,  hotkey,  app_grub_id FROM apps WHERE  app_grub_id = ?")   // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![grub_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(App {
                id: row.get(0)?,
                title: row.get(1)?,
                path: row.get(2)?,
                hotkey: row.get(3)?,
                app_grub_id: row.get(4)?,
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
pub fn update_grub_app__by_app_grub_id(
    app_grub_id: i32,
    app_id: i32,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn.execute(
          "UPDATE apps SET app_grub_id=?  WHERE id = ?",
            params![ app_grub_id, app_id  ],
        ).map_err(|e| e.to_string())?;
    Ok(changes)
}