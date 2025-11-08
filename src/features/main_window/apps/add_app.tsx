import {save} from '@tauri-apps/plugin-dialog'
import { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Iglobal_store } from '../../../global_store_types'
import { AppDispatch } from '../../../store'
import { get_apps_grubs_from_db } from '../../grubs_meneger_window/slice_store/app_grubs_Sclice'
import { invoke } from '@tauri-apps/api/core'

import './add_app.css'

interface Iapp_data{
    title:string,
    hotkey:string,
    app_grub_id:string


}
export default function Add_app__win(){
    const dispatch = useDispatch<AppDispatch>()
    const apps_grubs = useSelector((state:Iglobal_store)=>state.app_grubs_list.apps_grubs)
    useEffect(()=>{
 dispatch(get_apps_grubs_from_db())
    }, [])
    const app_grub_items = apps_grubs.map(grub=>{
return <option value={grub.id}>{grub.name}</option>
    })
    console.log(apps_grubs)
    const [app_path, set_app_path]= useState<string|null>("")
    const [new_app_data, set_new_app_data] = useState<Iapp_data>({
        title:"", 
     hotkey:"",
     app_grub_id:"0"
    })
    const hendel_chenge =(e:ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>{
        const {type, value, name}= e.target
      
 e.preventDefault()
     set_new_app_data((prev)=>({
        ...prev,
     [name]:value
     }))
    } 
    const add_app=async()=>{

        const data ={
            ...new_app_data,
            app_path:app_path
        }
        try{
            await invoke("add_app", {
                title:data.title, 
                path:data.app_path,
                hotkey:data.hotkey,
                appGrubId:Number(data.app_grub_id)
    
            })
            console.log(data)
            localStorage.setItem("rerender_apps", "true")

        }catch(err){
            console.error(err)
        }
    }   
    return( 
  <div className="add_app_form">
    <div className="input_block">

      <label htmlFor="title">Название:</label>
    <input id='title' type="text" name='title' value={new_app_data.title} onChange={hendel_chenge} />
    </div>
    <div className="input_block">

    <label htmlFor="hotkey">клавиша:</label>
  <input id='hotkey' type="text" name='hotkey' value={new_app_data.hotkey} onChange={hendel_chenge} />
    </div>
    <div className="input_block">
 <label htmlFor="app_grub_id">группа: </label>
    <select id='app_grub_id' name="app_grub_id"  value={new_app_data.app_grub_id} onChange={hendel_chenge}>
     {app_grub_items}
    </select>
    </div>
    <h2>{app_path}</h2>
    <div className="buton_block">

    <button onClick={async()=>{
        const path = await save({
          filters: [
            {
              name: 'app path',
              extensions: ['exe',],
            },
          ],
        });

        set_app_path(path)
        
    }
    
    }>путь  </button>
    
    <button onClick={()=>add_app()}>саздать</button>
    </div>

  </div>
    )}

    //            }}>выбрать папку </button> 

//         <button onClick={async()=>{
          

   


