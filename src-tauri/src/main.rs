// Prevents additional console window on Windows in release, DO NOT REMOVE!!

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
// use rusqlite::{params, Connection, Result};
// use tauri::command;
// use dirs_next::home_dir;

fn main() {
    //     if let Some(path) = home_dir() {
    //       println!("Путь к папке пользователя: {}", path.display());

    //   } else {
    //       println!("Не удалось определить путь к папке пользователя");
    //   }
    test_lib::run();
}
