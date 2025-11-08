

export interface IFolder{
    id:number
    icon_id:number,
    path:string, 
    title:string|null,
    hotkey:string|null
    folder_grub_id:number|null



}
export interface folder_props{
    id:number
    icon_id:number,
    title:string|null,
    path:string
    click_function?:(() => void)|undefined
    select_class?:string

}

export interface Icategory{
    id:number
    name:string
}
// "
// CREATE TABLE IF NOT EXISTS folders (
// id INTEGER PRIMARY KEY AUTOINCREMENT,
// icon_id INTEGER,
// path TEXT NOT NULL,
// title TEXT,
// hotkey TEXT,
// folder_grub_id INTEGER,
// FOREIGN KEY (folder_grub_id) REFERENCES folders_grub(id)
// )