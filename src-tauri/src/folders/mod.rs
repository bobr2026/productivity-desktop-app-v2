use std::path::PathBuf;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use dirs_next::home_dir;
use rusqlite::{params, Connection, Result};
use serde::Serialize;
use std::fs;

// fn get_db_path() -> Option<PathBuf> {
//     let dir_path = home_dir();
//     home_dir().map(|mut path| {
//        let new_dir_path = dir_path+"Admin-app";
//         // Создаем папку (если её ещё нет)
//        
//         path.push("Admin-app/my_db.db");
//         // path.push("Admin-app/Admin_app.db");
//         path
//     })
// }
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
pub fn add_folder(
    icon_id: i32,
    title: String,
    path: String,
    hotkey: String,
    folder_grub_id: i32,
) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "INSERT INTO folders (icon_id,title, path,hotkey, folder_grub_id) VALUES 
            (?, ?, ?, ?, ?)",
        params![icon_id, title, path, hotkey, folder_grub_id],
    )
    .map_err(|e| e.to_string())?;
    println!("Note added");
    Ok(())
}

//     "
//     CREATE TABLE IF NOT EXISTS folders (
// id INTEGER PRIMARY KEY AUTOINCREMENT,
// icon_id INTEGER,
// path TEXT NOT NULL,
// title TEXT,
// hotkey TEXT,
// folder_grub_id INTEGER,
// FOREIGN KEY (folder_grub_id) REFERENCES folders_grub(id)
// )

//                           "
#[derive(Serialize)]

pub struct Folder {
    id: i32,
    icon_id: i32,
    title: String,
    path: String,
    hotkey: String,
    folder_grub_id: i32,
}

#[tauri::command]
pub fn get_all_folders() -> Result<Vec<Folder>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, icon_id,path, title,  hotkey,  folder_grub_id FROM folders")
        .map_err(|e| e.to_string())?;
    let folders_iter = stmt
        .query_map([], |row| {
            Ok(Folder {
                id: row.get(0)?,
                icon_id: row.get(1)?,
                path: row.get(2)?,
                title: row.get(3)?,
                hotkey: row.get(4)?,
                folder_grub_id: row.get(5)?,
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
pub fn update_folder(
    icon_id: i32,
    path: String,
    hotkey: String,
    title: String,
    folder_grub_id: i32,
    folder_id: i32,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn.execute(
          "UPDATE folders SET icon_id = ?, path = ?, hotkey = ? title= ?,folder_grub_id=?  WHERE id = ?",
            params![icon_id,path,hotkey, title, folder_grub_id, folder_id  ],
        ).map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn delete_folder(folder_id: i32) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn
        .execute("DELETE FROM folders WHERE id = ?", params![folder_id])
        .map_err(|e| e.to_string())?;
    Ok(changes)
}

#[tauri::command]
pub fn get_foldersByID(folder_id: i32) -> Result<Vec<Folder>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT id, icon_id, path, title, hotkey, folder_grub_id FROM folders WHERE id = ?") // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![folder_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(Folder {
                id: row.get(0)?,
                icon_id: row.get(1)?,
                path:row.get(2)?,
                title: row.get(3)?,
                hotkey: row.get(4)?,
                folder_grub_id: row.get(5)?,
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
pub  fn get_all_foldersByGrub_id(grub_id: i32)-> Result<Vec<Folder>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    // Исправленный запрос: WHERE id = ?1 (или просто ?)
    let mut stmt = conn
        .prepare("SELECT id, icon_id, path, title, hotkey, folder_grub_id FROM folders WHERE  folder_grub_id = ?")   // Добавлено FROM notes
        .map_err(|e| e.to_string())?;

    // Исправлено:  params![note_id] теперь передается в execute
    let notes_iter = stmt
        .query_map(params![grub_id], |row| {
            // Используются параметры при выполнении запроса
            Ok(Folder {
                id: row.get(0)?,
                icon_id: row.get(1)?,
                path: row.get(2)?,
                title: row.get(3)?,
                hotkey: row.get(4)?,
                folder_grub_id: row.get(5)?,
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
pub fn update_grub_folder___by_grub_id(
    folder_grub_id: i32,
    folder_id: i32,
) -> Result<usize, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let changes = conn.execute(
          "UPDATE folders SET folder_grub_id=?  WHERE id = ?",
            params![ folder_grub_id, folder_id  ],
        ).map_err(|e| e.to_string())?;
    Ok(changes)
}