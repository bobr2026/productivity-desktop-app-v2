import { useEffect } from "react";
import { Iglobal_store } from "../../../global_store_types";
import { AppDispatch } from "../../../store";
import { delete_app, get_apps_from_db } from "./app_listSlice";

import { useDispatch, useSelector } from "react-redux";
import { invoke } from "@tauri-apps/api/core";
import { register } from "@tauri-apps/plugin-global-shortcut";
import { openApp } from "../../../servis";
import {confirm} from '@tauri-apps/plugin-dialog'
import { App_list_item_props } from "./app_types";

import './apps_list.css'


async function test(){
    await invoke("add_app",{title:"firefox", path:"C:\\Program Files\\Mozilla Firefox\\firefox.exe",hotkey:"Alt+5" , appGrubId:0} )
}

async function registerHotkey(hotkay:string|string[]|null, path_folder:string) {
    if(hotkay===null){
        
    }else{
        await register(hotkay, ()=>{
            openApp(path_folder)
            
            
            
        })
        
    }
}


export default  function Apps_list(){
    const  dispatch= useDispatch<AppDispatch>()
    const apps_list= useSelector((state:Iglobal_store)=>state.apps_list.apps)
   useEffect(()=>{
        localStorage.setItem("rerender_apps", "false")
          dispatch(get_apps_from_db())
        const id=setInterval(()=>{
       let rerender= localStorage.getItem('rerender_apps')
       if(rerender=="true"){
        dispatch(get_apps_from_db())
        localStorage.setItem("rerender_apps", "false")
       }
      
        },500)
        return()=>{
          clearInterval(id)
        }
         
        },[])
 console.log(apps_list)
 let app_item = apps_list.map(app=>{
    registerHotkey(app.hotkey, app.path)
    return <App_list_item id={app.id} path={app.path} title={app.title}/>
//     return <button key={app.id} onClick= {async()=> await openApp(app.path)} onContextMenu={async(e)=>{
//         e.preventDefault();
//         const confirmation = await confirm(
//           'This action cannot be reverted. Are you sure?',
//           { title: 'Tauri', kind: 'warning' }
//         );
//         if(confirmation){
// let rerender= localStorage.getItem('rerender_apps')
//           if(rerender=="false"){
//             await invoke("delete_app", {appId:app.id})
            
//             localStorage.setItem("rerender_apps", "true")
//           }
//           dispatch(delete_app(app.id))
//         }
//        console.log(confirmation)
          
    
//     }}>{app.title}</button>
 }) 
 return(
    <div className="apps_list__div">
{app_item}
    </div>
 )
}

export function App_list_item({id, path, title}:App_list_item_props){
    const  dispatch= useDispatch<AppDispatch>()
return(
    <button className="button_start_app"  key={id} onClick= {async()=> await openApp(path)} onContextMenu={async(e)=>{
        e.preventDefault();
        const confirmation = await confirm(
          'This action cannot be reverted. Are you sure?',
          { title: 'Tauri', kind: 'warning' }
        );
        if(confirmation){
let rerender= localStorage.getItem('rerender_apps')
          if(rerender=="false"){
            await invoke("delete_app", {appId:id})
            
            localStorage.setItem("rerender_apps", "true")
          }
          dispatch(delete_app(id))
        }
       console.log(confirmation)
          
    
    }}>{title}</button>
)
}