use std::path::PathBuf;
// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use dirs_next::home_dir;
use rusqlite::{params, Connection, Result};
use serde::Serialize;
use std::thread;

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
pub fn addApps_grub(name: String) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute("INSERT INTO apps_grub (name) VALUES (?)", params![name])
        .map_err(|e| e.to_string())?;
    println!("Note added");
    Ok(())
}

#[tauri::command]
pub fn deletApps_grubByID(apps_grub_id: i32) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM apps_grub WHERE id = ?", params![apps_grub_id])
        .map_err(|e| e.to_string())?;
    println!("Note added");
    Ok(())
}
#[derive(Serialize)]
pub struct AppsGrub {
    id: i32,
    name: String,
}

#[tauri::command]
pub fn getAllAppsGrub() -> Result<Vec<AppsGrub>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, name FROM apps_grub")
        .map_err(|e| e.to_string())?;
    let folders_iter = stmt
        .query_map([], |row| {
            Ok(AppsGrub {
                id: row.get(0)?,
                name: row.get(1)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut folders = Vec::new();
    for folder in folders_iter {
        folders.push(folder.map_err(|e| e.to_string())?);
    }
    Ok(folders)
}

#[tauri::command]
pub fn addFolders_grub(name: String) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute("INSERT INTO folders_grub (name) VALUES (?)", params![name])
        .map_err(|e| e.to_string())?;
    println!("Note added");
    Ok(())
}

#[tauri::command]
pub fn deletFolders_grubByID(folder_grub_id: i32) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute(
        "DELETE FROM folders_grub WHERE id = ?",
        params![folder_grub_id],
    )
    .map_err(|e| e.to_string())?;
    println!("folder grub del");
    Ok(())
}
#[derive(Serialize)]
pub struct FolderGrub {
    id: i32,
    name: String,
}
#[tauri::command]
pub fn getAllFoldersGrub() -> Result<Vec<FolderGrub>, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare("SELECT id, name FROM folders_grub")
        .map_err(|e| e.to_string())?;
    let folders_iter = stmt
        .query_map([], |row| {
            Ok(FolderGrub {
                id: row.get(0)?,
                name: row.get(1)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut folders = Vec::new();
    for folder in folders_iter {
        folders.push(folder.map_err(|e| e.to_string())?);
    }
    Ok(folders)
}

#[tauri::command]
pub fn getFoldersGrubById(folderGrubId: i32) -> Result<String, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let res = conn
        .query_row(
            "SELECT name FROM  folders_grub WHERE id =?",
            params![folderGrubId],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    Ok(res)
}

// #[tauri::command]
// pub   fn getFoldersGrubById)folderGrubId:i32) -> Result<String,  String> {
//       let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
//       let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
//      let res =  conn.query_row(
//          "SELECT name FROM  categories WHERE id =?",
//           params![folderGrubId],
//           |row| row.get(0)
//       ).map_err(|e| e.to_string())?;

//       Ok(res)
//   }

#[tauri::command]
pub fn addCategory(name: String) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute("INSERT INTO categories (name) VALUES (?)", params![name])
        .map_err(|e| e.to_string())?;
    println!("Note added");
    Ok(())
}

#[tauri::command]
pub fn deleteCategoryByID(category_id: i32) -> Result<(), String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM categories WHERE id = ?", params![category_id])
        .map_err(|e| e.to_string())?;
    println!("Note added");
    Ok(())
}

#[derive(Serialize)]
pub struct Categories {
    id: i32,
    name: String,
}
#[tauri::command]
pub fn get_all_categories() -> Result<Vec<Categories>, String> {
    let handle = thread::spawn(|| {
        let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
        let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
        let mut stmt = conn
            .prepare("SELECT id, name FROM categories")
            .map_err(|e| e.to_string())?;
        let folders_iter = stmt
            .query_map([], |row| {
                Ok(Categories {
                    id: row.get(0)?,
                    name: row.get(1)?,
                })
            })
            .map_err(|e| e.to_string())?;

        let mut folders = Vec::new();
        for folder in folders_iter {
            folders.push(folder.map_err(|e| e.to_string())?);
        }
        Ok(folders)
    });
    handle.join().map_err(|e| "Thread panicked".to_string())?
}

#[tauri::command]
pub fn getCategoryById(categoryId: i32) -> Result<String, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;
    let res = conn
        .query_row(
            "SELECT name FROM  categories WHERE id =?",
            params![categoryId],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    Ok(res)
}
