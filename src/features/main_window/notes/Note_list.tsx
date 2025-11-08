import {useState, useEffect} from "react";
import './Note_list.css'
import { invoke } from "@tauri-apps/api/core";
import {  Note_props } from "./note_types";
import {openWindow, } from "../../../servis";
import { useSelector, useDispatch  } from "react-redux";
import { AppDispatch } from "../../../store";
import { Iglobal_store } from "../../../global_store_types";
import { delete_notes, get_notes_from_db } from "./notes_listSlice";
import { confirm } from '@tauri-apps/plugin-dialog';

function Note({id, title, category_id, created_at, updated_at,}:Note_props){
  const dispatch= useDispatch<AppDispatch>()
    const [Category, setCategory] = useState<string>("")

    
    useEffect(()=>{

        async function loadNotes() {
                try { 
                  const category:string = await invoke('getCategoryById', {categoryId:category_id});
                  setCategory(category)
                 
                  console.log(category)
                  

                  
                }catch (e) {
                  console.error(e);
                }
                
              }
  
            
            loadNotes()
    },[category_id])

    return(
        <div key={id} className="note_element" onContextMenu={async(e)=>{
          e.preventDefault();
          const confirmation = await confirm(
            'This action cannot be reverted. Are you sure?',
            { title: 'Tauri', kind: 'warning' }
          );
          if(confirmation){
let rerender= localStorage.getItem('rerender_notes')
            if(rerender=="false"){
              await invoke("delete_note", {noteId:id})
              
              localStorage.setItem("rerender_notes", "true")
            }
            dispatch(delete_notes(id))
          }
         console.log(confirmation)


        }} onClick={()=>{openWindow(`/note_detels/${id}`,`note_detels/${id}`, 600, 800)}}>
        <p className="note_title">{title}</p>
        <p>Создан: {created_at}</p>
        <p> Обновлён: {updated_at}</p>
        <p>Катигория: {Category}</p>
        </div>
    )
}
export default  function Note_list(){
 const dispatch= useDispatch<AppDispatch>()
 

//  const last_note_id= useSelector((state:Iglobal_store)=>state.notes_list.last_note_id)


 useEffect(()=>{
  localStorage.setItem("rerender_notes", "false")
    dispatch(get_notes_from_db())
  const id=setInterval(()=>{
 let rerender= localStorage.getItem('rerender_notes')
 if(rerender=="true"){
  dispatch(get_notes_from_db())
  localStorage.setItem("rerender_notes", "false")
 }

  },500)
  return()=>{
    clearInterval(id)
  }
   
  },[])
 


  const notes= useSelector((state:Iglobal_store)=>state.notes_list.notes)
  console.log(notes)
  // let last_index= notes[notes.length-1].id
  // dispatch(select_last_note_id(last_index))
  let notes_list
 function filter(filter_data?:string){
  if(filter_data==null){
  notes_list= notes.map(note=>{
     return <Note key={note.id} id={note.id} title={note.title} category_id={note.category_id} created_at={note.created_at}
     updated_at={note.updated_at} />
 })   

}else if(filter_data=="1"){
  notes_list= notes.map(note=>{
    if(note.category_id==Number(filter_data)){
      return <Note  key={note.id}id={note.id} title={note.title} category_id={note.category_id} created_at={note.created_at}
      updated_at={note.updated_at} />

    }
  })
}
      }
      filter()

    return(
        <div className="notes_list">
           {notes_list}
        </div>
    )
}
