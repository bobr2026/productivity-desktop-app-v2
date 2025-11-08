import folder_dark1_icon from './folder_icons/ficon-folder-dark1.png'
import folder_blue_icon from './folder_icons/icon-folder-blue.png'
import icon_folder_black from './folder_icons/icon-folder-black.png'


import "./add_folder.css"
import { useEffect, useState } from 'react'
import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core'
import { Icategory } from './folder_types'
// import { useParams } from 'react-router-dom'
// when using `"withGlobalTauri": true`, you may use
// const { open } = window.__TAURI__.dialog;

// Open a dialog

// Prints file path or URI


interface Ifolder_icons{
    id:number,
    icon_path:string
}
interface Iselect_folder{
id:number
selet:boolean
}
const folder_icons:Ifolder_icons[]=[
    {id:1,icon_path:folder_dark1_icon},
    {id:2,icon_path:folder_blue_icon},
    {id:3,icon_path:icon_folder_black}

]
// icon_id: i32,
// title: String,
// path: String,
// hotkey: String,
// folder_grub_id: i32,

export default function  Add_folder_win(){
    // const {folder_id}= useParams()

    const [selet_icon, set_select_icon]= useState<Iselect_folder>({id:1, selet:false})
    const [folder_path, set_folder_path]=useState<string|null>(null)
    const [hotkay, set_hotkey] = useState("")
    const [title, set_title] = useState("")
    const [categorys, setCategorys]= useState<Icategory[]>([])
    const [selet_folder_grub, set_selet_folder_grub]= useState<Iselect_folder>({id:0, selet:false})
    useEffect(()=>{
        async function get_all_categories() {
            const category_list:Icategory[] = await invoke("getAllFoldersGrub")
            console.log(category_list)
            setCategorys(category_list)
            
        }
        get_all_categories()
    }, [])
    const category_list =categorys.map(category=>{
        return <li className={(category.id==selet_folder_grub.id&&selet_folder_grub.selet ==true)
            ?"folders_grub_item_active":"folders_grub_item"}  key={category.id} onClick={()=>{set_selet_folder_grub({id:category.id, selet:(selet_folder_grub.selet==false)?true:false})}}>{category.name} </li>
        })
        const folders_list= folder_icons.map(icon=>{
            return  <img className={(icon.id==selet_icon.id&&selet_icon.selet==true)?"folder_icon_active":"folder_icon"}
            key={icon.id} src={icon.icon_path} alt="" onClick={()=>{set_select_icon({id:icon.id, selet:(selet_icon.selet==false)?true:false})}}/>
        })
        
        console.log(selet_icon)
        console.log(selet_folder_grub)
        return(
            
            <>
            <div className="add_folder_page">

    <p className='icom_block_title'>выбрать иконку </p>
     <div className="folder_icons_block">
        {folders_list}
     </div>
     <p>{folder_path==null?"":folder_path}</p>
     <button onClick={async()=>{
         const file = await open({
             multiple: false,
             directory: true,
            });
            console.log(file)
            set_folder_path(file)
        }}>выбрать папку </button>
        <div className="input_block_folder">
        <label htmlFor="input"> название</label>
 <input id='title' type="text" onChange={(e)=>{e.preventDefault(),
         set_title(e.target.value)}} value={title} />
        </div>
        <div className="input_block_folder">
        <label htmlFor="hotkey">клавиша</label>
     <input type="text" onChange={(e)=>{e.preventDefault(),
         set_hotkey(e.target.value)}} value={hotkay} />
        </div>

         <div className="folder_grub_list">
<ul>
    {category_list}
</ul>
         </div>
         <button onClick={()=>{add_folder()}}>саздать</button>
            </div>

    </>

)
// icon_id: i32,
// title: String,
// path: String,
// hotkey: String,
// folder_grub_id: i32,
interface Iadd_folder{
icon_id: number,
title: string,
path: string,
hotkey: string|null,
folder_grub_id: number,

}
 async function add_folder(){
    const data:Iadd_folder ={
 icon_id:selet_icon.id,
 title:title,
 path:folder_path as string,
 hotkey:hotkay,
 folder_grub_id:selet_folder_grub.id
 
}
await invoke('add_folder', {iconId:data.icon_id, title:data.title, 
            path:data.path,
            hotkey:data.hotkey, folderGrubId:data.folder_grub_id
        });
        localStorage.setItem("rerender", "true")


console.log(data)
}
}