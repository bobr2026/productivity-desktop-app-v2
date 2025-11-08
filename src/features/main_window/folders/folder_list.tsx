// import React, {useState, useEffect} from "react";
import { invoke } from '@tauri-apps/api/core'
import dark1_icon from  './folder_icons/ficon-folder-dark1.png'
import dark_icon from  "./folder_icons/icon-folder-black.png"
import blue_icon from  "./folder_icons/icon-folder-blue.png"
import './folder_list.css'
import { useEffect, useState } from 'react'
import { folder_props, } from './folder_types'
import { register } from '@tauri-apps/plugin-global-shortcut';
import { delete_folder, get_folders_from_db } from './folder_listSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../../store'
import { Iglobal_store } from '../../../global_store_types'
import { confirm } from '@tauri-apps/plugin-dialog';


// async function test() {
//     try {
//       const notes = await invoke('add_folder', {iconId:3, title:"db4", 
//         path:"C:\\Users\\DEV\\Admin-app",
//         hotkey:"alt+3", folderGrubId:1
//     });
    
    
    
//     console.log(notes);
//   } catch (e) {
//     console.error(e);
// }
// }
async function registerHotkey(hotkay:string|string[]|null, path_folder:string) {
  if(hotkay===null){

  }else{


      await register(hotkay, ()=>{
          openFolder(path_folder)
  
       
        
      })

  }
}
async function openFolder(path: string) {
    try {
        await invoke('open_folder', { folderPath: path });


    } catch (error) {
      console.error('Failed to open folder:', error);
    }
  }
    
// test()
 export function Folder({ icon_id, id, title, path,click_function, select_class}:folder_props){
  const [selet_active_folder, set_selet_active_folder] = useState(false)
  const dispatch= useDispatch<AppDispatch>()

  // {id:1,icon_path:folder_dark1_icon},
  // {id:2,icon_path:folder_blue_icon},
  // {id:3,icon_path:icon_folder_black}
let icon
  switch (icon_id) {
    case 1:
      icon= <img src={dark1_icon} alt="" />
      break;
      case 2:
        icon=  <img src={blue_icon} alt="" />
        break;
      case 3:
        icon= <img src={dark_icon} alt="" />
             break;
  }
// let icon= icon_id==1? <img src={dark1_icon} alt="" />:<img src={dark_icon} alt="" />
// if(icon_id==3){
//     icon= <img src={blue_icon} alt="" />
// }


    return(
        <div key={id} className={(select_class!==undefined&& selet_active_folder==true)?select_class:"folder_item"} onClick={()=>{(click_function==undefined?openFolder(path):click_function(), set_selet_active_folder((selet_active_folder==false?true:false)))}}onContextMenu={async(e)=>{
                  e.preventDefault();
                  const confirmation = await confirm(
                    'This action cannot be reverted. Are you sure?',
                    { title: 'Tauri', kind: 'warning' }
                  );
                  if(confirmation){
      let rerender= localStorage.getItem('rerender')
                    if(rerender=="false"){
                      await invoke("delete_folder", {folderId:id})
                      
                      localStorage.setItem("rerender", "true")
                    }
                    dispatch(delete_folder(id))
                  }
                 console.log(confirmation)
                    
              
                      
                //   }
        
                }} 
                >
         
            {/* <p>Курсы Курсы Курсы</p> */}
            <div className="folder_title">
           {title}
            </div>
        {icon}
    
     
        </div>
    )
}
export default  function Folder_list(){
  const dispatch= useDispatch<AppDispatch>()
    

    useEffect(()=>{
      localStorage.setItem("rerender", "false")
        dispatch(get_folders_from_db())
      const id=setInterval(()=>{
     let rerender= localStorage.getItem('rerender')
     if(rerender=="true"){
      dispatch(get_folders_from_db())
      localStorage.setItem("rerender", "false")
     }
    
      },500)
      return()=>{
        clearInterval(id)
      }
       
      },[])
      const folders= useSelector((state:Iglobal_store)=>state.folders_list.folders)
   
    let folder_list = folders.map(folder=>{
      registerHotkey(folder.hotkey, folder.path)
        return (<Folder  icon_id={folder.icon_id} id={folder.id} title={folder.title} path={folder.path}/>)
    })
    return(
        <div className="folder_list">
         {folder_list}
         {/* <Folder icon_id={5} id={3} title={"ttrt"}/>
         <Folder icon_id={5} id={3} title={"ttrt"}/>
         <Folder icon_id={5} id={3} title={"ttrt"}/>
         <Folder icon_id={5} id={3} title={"ttrt"}/>
         <Folder icon_id={5} id={3} title={"ttrt"}/> */}
         
        </div>
    )
}

