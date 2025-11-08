
use std::process::Command;

#[tauri::command]
pub fn open_app(app_path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    
         use std::process::Command;
    
        Command::new("cmd")
            .args(&["/C", "start", "", &app_path])
            .spawn()
            .map_err(|e| e.to_string())?;
    {
        // Command::new("start")
        //     .arg(&app_path)
        //     .spawn()
        //     .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "macos")]
    {
        Command::new(app_path).spawn().map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "linux")]
    {
        Command::new(app_path).spawn().map_err(|e| e.to_string())?;
    }
    Ok(())
}
#[tauri::command]
pub fn open_folder(folder_path: String) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        Command::new("explorer")
            .arg(&folder_path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "macos")]
    {
        Command::new("open")
            .arg(&folder_path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(target_os = "linux")]
    {
        Command::new("xdg-open")
            .arg(&folder_path)
            .spawn()
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}
