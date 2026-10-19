// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use rusqlite::{Connection, Result};
mod servis;

use servis::get_db_path;
mod notes;
use notes::{add_note, delete_note, get_all_notes, get_noteByID, get_all_notesByCategory_id , update_grub_notes___by_grub_id};
mod folders;
use folders::{add_folder, delete_folder, get_all_folders, update_folder, get_foldersByID,get_all_foldersByGrub_id , update_grub_folder___by_grub_id};
mod apps;
use apps::{update_app, add_app, get_all_apps, delete_app, get_all_appsByGrub_id, get_appsByID, update_grub_app__by_app_grub_id};
mod grubs;
use grubs::{
    addApps_grub, addCategory, addFolders_grub, deletApps_grubByID, deletFolders_grubByID,
    deleteCategoryByID, getAllAppsGrub, getAllFoldersGrub, getCategoryById, getFoldersGrubById,
    get_all_categories,
};
mod start_app_and_folder;
use start_app_and_folder::{open_app, open_folder};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn init_db() -> Result<String, String> {
    let db_path = get_db_path().ok_or("Home directory not found".to_string())?;
    let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

    conn.execute(
        "
     CREATE TABLE IF NOT EXISTS categories (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE)
                          ",
        [],
    )
    .map_err(|e| e.to_string())?;
    conn.execute(
        "
CREATE TABLE IF NOT EXISTS folders_grub (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL UNIQUE)",
        [],
    )
    .map_err(|e| e.to_string())?;
    conn.execute(
        "
CREATE TABLE IF NOT EXISTS apps_grub (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL UNIQUE)",
        [],
    )
    .map_err(|e| e.to_string())?;
    conn.execute(
        "
                         CREATE TABLE IF NOT EXISTS notes (
      note_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category_id INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id)
  )
                                    ",
        [],
    )
    .map_err(|e| e.to_string())?;


    
    conn.execute(
        "
              CREATE TABLE IF NOT EXISTS apps (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       title TEXT NOT NULL,
       path TEXT NOT NULL,
       hotkey TEXT,
       app_grub_id INTEGER,
       FOREIGN KEY (app_grub_id) REFERENCES apps_grub(id)
   )
  
                                    ",
        [],
    )
    .map_err(|e| e.to_string())?;

    conn.execute(
        "
              CREATE TABLE IF NOT EXISTS folders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        icon_id INTEGER,
        path TEXT NOT NULL,
        title TEXT,
        hotkey TEXT,
        folder_grub_id INTEGER,
        FOREIGN KEY (folder_grub_id) REFERENCES folders_grub(id)
    )
  
                                    ",
        [],
    )
    .map_err(|e| e.to_string())?;

    conn.execute(
        "
CREATE TRIGGER IF NOT EXISTS update_notes_updated_at
  AFTER UPDATE ON notes
  BEGIN
      UPDATE notes SET updated_at = DATETIME('now') WHERE id = NEW.id;
  END ",
        [],
    )
    .map_err(|e| e.to_string())?;
    Ok("Database initialized".to_string())
}

use tauri::Runtime;

#[tauri::command]
async fn restart_app<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    app.restart();
    Ok(())
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_os::init())
        .setup(|app| {
            // Можно вызвать функцию напрямую
            match init_db() {
                Ok(msg) => println!("{}", msg),
                Err(err) => eprintln!("DB init error: {}", err),
            }
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            init_db,
            get_noteByID,
            get_all_notesByCategory_id,
            delete_note,
            get_all_notes,
            add_note,
            add_folder,
            delete_folder,
            get_all_folders,
            update_folder,
            get_foldersByID,
            get_all_foldersByGrub_id,
            update_app, 
            add_app, get_all_apps,
             delete_app, get_all_appsByGrub_id, 
            get_appsByID,
            addApps_grub,
            addCategory,
            addFolders_grub,
            getFoldersGrubById,
            deletApps_grubByID,
            deletFolders_grubByID,
            deleteCategoryByID,
            getAllAppsGrub,
            getAllFoldersGrub,
            get_all_categories,
            getCategoryById,
            open_app,
            open_folder,
            restart_app,

            
            update_grub_notes___by_grub_id,
            update_grub_app__by_app_grub_id, 
            update_grub_folder___by_grub_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
