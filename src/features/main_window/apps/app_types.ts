export interface IApp{
    id:number
    title:string,
    path:string, 
    hotkey:string|null
    app_grub_id:number

}
export interface App_list_item_props{
    id:number,
     path:string,
     title:string
}