import { ChangeEvent, useEffect, useState } from 'react'
import './grub_meneger_win.css'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '../../store'
import { get_notes_grubs_from_db } from './slice_store/note_grubs_Sclice'
import { get_apps_grubs_from_db } from './slice_store/app_grubs_Sclice'
import { get_folder_grubs_from_db } from './slice_store/folder_grubs_Sclice'
import {  Iglobal_store } from '../../global_store_types'




import {delete_notes, get_all_notes_by_category_id, get_notes_from_db}from "../main_window/notes/notes_listSlice"
import {get_folders_from_db, get_all_foldersBy_GrubId_from_db}from "../main_window/folders/folder_listSlice"
import { Folder } from '../main_window/folders/folder_list'
import { openWindow } from '../../servis'
import { invoke } from '@tauri-apps/api/core'
import { confirm } from '@tauri-apps/plugin-dialog';
import { add_select_element, delete_select_element,reset_select_element  } from './slice_store/select_elements_Sclice'


import { get_all_elemets } from './setvis_grubs'
import { get_all_appsByGrub_id, get_apps_from_db } from '../main_window/apps/app_listSlice'
import { openApp } from "../../servis";
import { App_list_item } from '../main_window/apps/app_list'

 
type typesGrub="apps_grubs"|"folders_grubs"|"notes_grubs"
type type_element ="folder"|"note"|"app"




 
export default function Grub_meneger_win(){
  const dispatch=  useDispatch<AppDispatch>()
  const [select_type_grub, set_select_type_grub]= useState<typesGrub>("notes_grubs")
  const [delete_element, set_delete_element]= useState(false)
  const [create_element, set_create_element]= useState(false)
  const [select_all_elements_chekbox,set_select_all_elements__chekbox] = useState(false)
  const [select_element_index, set_select_element_index] =useState(0)
  console.log(select_all_elements_chekbox)
  const [delete_element_grub, set_elete_element_grub] = useState(false)


  // ui state
const [delete_element_ui, set_delete_element_ui] = useState(false)




     useEffect(()=>{
   dispatch(get_notes_grubs_from_db())
   dispatch(get_apps_grubs_from_db())
   dispatch(get_folder_grubs_from_db())
 dispatch(get_notes_from_db())
 dispatch(get_folders_from_db())
 dispatch(get_apps_from_db())

 set_create_element(false)
 set_delete_element(false)
 set_elete_element_grub(false)
set_delete_element_ui(false)


}, [delete_element, create_element, ])
useEffect(()=>{
  localStorage.setItem("rerender_notes_meneger", "false")
  dispatch(get_notes_from_db())
  const id=setInterval(()=>{
    let rerender= localStorage.getItem('rerender_notes_meneger')
    if(rerender=="true"){
      dispatch(get_notes_from_db())
      localStorage.setItem("rerender_notes_meneger", "false")
    }
    
  },500)
  return()=>{
    clearInterval(id)
  }
  
},[])



    function hendelChekbox(e:ChangeEvent<HTMLInputElement>){
      set_select_all_elements__chekbox(e.target.checked)
      if(!select_all_elements_chekbox){
        dispatch(reset_select_element())
      }
      
      
    }   
    
    let select_element= useSelector((state:Iglobal_store)=>state.select_elements_list.select_element)
    const notes_grubs = useSelector((sate:Iglobal_store)=>sate.notes_Grub_list.notes_grubs)
    const folders_grubs = useSelector((sate:Iglobal_store)=>sate.folder_grubs_list.folders_grubs)
    const apps_grubs_list = useSelector((state:Iglobal_store)=>state.app_grubs_list.apps_grubs)
    
    

    
    console.log(select_element)
    function add_select_elements(type: type_element, id: number) {
     
      set_select_element_index(id)
      select_element.forEach(elem=>{
        if(elem.elemnt_id===select_element_index){
          dispatch(delete_select_element(id));
        }
      }
      
    )
    const existingIndex = select_element.findIndex(elem => elem.elemnt_id === id);
    
    if (existingIndex !== -1) {
      // Элемент уже выбран, удаляем его
      dispatch(delete_select_element(id));
    } else {
      // Элемент не выбран, добавляем его
      dispatch(add_select_element({ type_element: type, elemnt_id: id }));
    }


    
  }
  async function delete_grub(id:number){
  switch (select_type_grub) {
    case "notes_grubs":
    await invoke("deleteCategoryByID", {categoryId:id}), set_delete_element(true)
      break;
      case 'apps_grubs':
        await invoke("deletApps_grubByID", {appsGrubId:id}),set_delete_element(true)
        break
      case 'folders_grubs':
        await invoke("deletFolders_grubByID", {folderGrubId:id}), set_delete_element(true)
        break;
        default:
          break;
        }
      }
  
     console.log(select_type_grub)
     let grubs_data_list
     let grub_ditals
     if(select_type_grub=='notes_grubs'){
    
         const notes_list = useSelector((state:Iglobal_store)=>state.notes_list.notes)
    grub_ditals = notes_list.map(note=>{
      const grub_ditals_item = select_all_elements_chekbox==true?<>
       <h2>{note.title}</h2><input type="checkbox" /></>:<><h2>{note.title}</h2></>
      
           return   <div className="grub_ditals_item" key={note.id} onClick={()=>(select_all_elements_chekbox==true?add_select_elements("note", note.id ):openWindow(`/note_detels/${note.id}`,`note_detels/${note.id}`, 600, 800))} onContextMenu={async(e)=>{
            e.preventDefault();
            const confirmation = await confirm(
              'This action cannot be reverted. Are you sure?',
              { title: 'Tauri', kind: 'warning' }
            );
            if(confirmation){
  let rerender= localStorage.getItem('rerender_notes')
              if(rerender=="false"){
                await invoke("delete_note", {noteId:note.id})
                
                localStorage.setItem("rerender_notes", "true")
              }
              set_delete_element(true)
              dispatch(delete_notes(note.id))
            }

           console.log(confirmation)
  
                 
          }}>
            {grub_ditals_item}
              {/* <h2>{note.title}</h2><input type="checkbox" /> */}
          

               </div>
        })
         grubs_data_list = notes_grubs.map(grub=>{
           
            return      <div className="grub_item" key={grub.id} onClick={()=> (delete_element_grub==false?dispatch(get_all_notes_by_category_id(grub.id)):delete_grub(grub.id))}>
              {/* // ()=>{dispatch(get_all_notes_by_category_id(grub.id)), console.log(notes_list)}}> */}
            <p>Название:{grub.name}</p>
                  {/* <p>Элементов:{notes_list.length}</p>  */}
        <p>группа: заметки</p>
    </div>
         })
         

        }else if(select_type_grub=='folders_grubs'){
          const folder_list = useSelector((state:Iglobal_store)=>state.folders_list.folders)
        grub_ditals = folder_list.map(folder=>{
              //  return  (<Folder  icon_id={folder.icon_id} id={folder.id} title={folder.title} path={folder.path} click_function={add_select_elment({type_element:"folder", elemnt_id:folder.id})}/>)
              // return  (<Folder  key={folder.id} icon_id={folder.icon_id} id={folder.id} title={folder.title} path={folder.path} click_function={()=>add_select_elements("folder", folder.id )}/>)
              if(select_all_elements_chekbox){
                   return  (<Folder  key={folder.id} icon_id={folder.icon_id} id={folder.id} title={folder.title} path={folder.path} click_function={()=>{add_select_elements("folder", folder.id )}} select_class='folder_item_active'/>)
              }else{

                return  (<Folder  key={folder.id} icon_id={folder.icon_id} id={folder.id} title={folder.title} path={folder.path}  />)
              }
            })
            grubs_data_list = folders_grubs.map(grub=>{
               // console.log(notes_list)
               return      <div className="grub_item" key={grub.id} onClick={()=> (delete_element_grub==false?dispatch(get_all_foldersBy_GrubId_from_db(grub.id)):delete_grub(grub.id))}>
              {/* //  return      <div className="grub_item" key={grub.id} onClick={()=>{dispatch(get_all_foldersBy_GrubId_from_db(grub.id))}}> */}
                   
               <p>Название:{grub.name}</p> 
          
          
           <p>группа: папки</p>
       </div>
     })
   

    }
    else  {
      grubs_data_list=   apps_grubs_list.map(grub=>{
        return  <div key={grub.id} className="grub_item" onClick={()=> (delete_element_grub==false?dispatch(get_all_appsByGrub_id(grub.id)):delete_grub(grub.id))}>
            
        <p>Название:{grub.name}</p>
    <p>группа: приложения</p>
</div> 
      })
      const apps_list = useSelector((state:Iglobal_store)=>state.apps_list.apps)
      grub_ditals = apps_list.map(app=>{
            return <App_list_item id={app.id} path={app.path} title={app.title}/>
      })
    }
        
async function add_promnt(){
 let new_grub_name = await prompt("название группы ")
 console.log(new_grub_name)
 if(new_grub_name!=null){
   switch (select_type_grub) {
    case "notes_grubs":
       await invoke("addCategory", {name:new_grub_name}), set_create_element(true)
      break;
      case"folders_grubs":
       await invoke("addFolders_grub", {name:new_grub_name}), set_create_element(true)
      break;
      case"apps_grubs":
      await invoke("addApps_grub", {name:new_grub_name}), set_create_element(true)
      break;
    default:
      break;
   }
 }
}
const [new_grub_id_select, set_new_grub_id_select]= useState <string>("")
function hendel_select_grub_id__option(e:ChangeEvent<HTMLSelectElement>){
  e.preventDefault()
 set_new_grub_id_select( e.target.value)
 
}
console.log(new_grub_id_select)

const option_item_grub_munu=   add_grub_menu()
const updete_element_byGrub = select_all_elements_chekbox==true?
<select value={new_grub_id_select} onChange={hendel_select_grub_id__option}>
 {option_item_grub_munu}
</select>
:null

const button_update_grub =  select_all_elements_chekbox==true? <button onClick={async()=>hendel_update_grub()}> test</button>:null

 async function hendel_update_grub(){
  await get_all_elemets(select_element,Number( new_grub_id_select))
  localStorage.setItem("rerender_notes", "true")
  set_create_element(true)
}


     return(
        <> 
        <div className="btn_grubs">

        <div className="btn_select_grubs">

        <button onClick={()=>{set_select_type_grub("notes_grubs")}}>заметки</button>
        <button onClick={()=>{set_select_type_grub( "folders_grubs")}}>папки</button>
        <button onClick={()=>{set_select_type_grub("apps_grubs")}}>приложения</button>
        </div>
        <input type="checkbox" onChange={hendelChekbox} value={String(select_all_elements_chekbox)} />
        <div className="">
        <button onClick={async()=>{add_promnt()}}>дабавить группу </button>
        <button onClick={()=>{
          set_delete_element_ui((delete_element_ui==false?true:false))
          set_elete_element_grub(true)
        }}
          >{delete_element_ui==false?"удалить группу":"X"}</button>
          {updete_element_byGrub}
        </div>
      
        {button_update_grub}
     
        </div>

    

        <div className="grubs_meneger_page">
        <div className="grubs_list">
   {grubs_data_list}
   
        </div>
        <div className={select_type_grub==='folders_grubs'?"folder_list":"grub_ditals"}>
  {grub_ditals}   </div>

        </div>
        </>

    )
  function add_grub_menu(){
   let  option_item
      switch (select_type_grub) {
        case "notes_grubs":
       
    option_item=  notes_grubs.map(category=>{
          return <option value={category.id}>{category.name}</option>

        })
          break;
          case 'apps_grubs':
            option_item=   apps_grubs_list.map(category=>{
              return <option value={category.id}>{category.name}</option>
              
            })
            break;
          case 'folders_grubs':
      option_item=     folders_grubs.map(category=>{
            return <option value={category.id}>{category.name}</option>
           })
            break;
      
        default:
          break;
      }
      return option_item
    }
}
