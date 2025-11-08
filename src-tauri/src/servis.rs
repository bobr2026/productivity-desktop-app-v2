use dirs_next::home_dir;
use std::path::PathBuf;

use std::fs;

pub fn get_db_path() -> Option<PathBuf> {
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