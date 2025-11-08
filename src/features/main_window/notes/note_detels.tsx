import { invoke } from "@tauri-apps/api/core";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Icategory, INote } from "./note_types";


import './note_detels.css'
import { AppDispatch } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import {  get_notes_from_db,} from "./notes_listSlice";
import { Iglobal_store } from "../../../global_store_types";
export default   function Note_detels(){
  const [note, setNote]= useState<INote|null>(null)
  const [updete, setUpdete] = useState(false)
  const [categorys, setCategorys]= useState<Icategory[]>([])
  const {note_id}= useParams()
  console.log(note_id)

  const dispatch= useDispatch<AppDispatch>()
  useEffect(()=>{

    dispatch(get_notes_from_db())
  }, [])
  const notes_list = useSelector((state:Iglobal_store)=>state.notes_list.notes)
  const last_note_id= useSelector((state:Iglobal_store)=>state.notes_list.last_note_id)
  console.log(notes_list)
  let last_category_index=1
  if(note_id==undefined){
    useEffect(()=>{
      async function loadNotes() {
        try {
   
          const category:Icategory[] = await invoke('get_all_categories', );
          console.log(category)
          setCategorys(category)
         last_category_index=Number(category[0].id)

       
          
          
          
          
        } catch (e) {
          console.error(e);
        }
      }
    
loadNotes()
},[])
}else{

  useEffect(()=>{
      async function loadNotes() {
          try {
            const data:INote[] = await invoke('get_noteByID', {noteId:parseInt(note_id!)});
            const category:Icategory[] = await invoke('get_all_categories', );
            console.log(category)
            setCategorys(category)

            const notes = data[0]
            console.log(notes)
            setNote(notes)

            
            setUpdete(true)
            
            
          } catch (e) {
            console.error(e);
          }
        }
      
loadNotes()
},[])
}



const [dataInit, setDataInit]= useState(false)
console.log(dataInit)


interface data{
  title:string,
  content:string|null,
  category_id:number|null

}
const [form_data, setForm_data]= useState<data>({
  title:"",
  content:"",
  category_id:0
})
useEffect(()=>{

  if(note!=null){
    setForm_data(prev=>({
      ...prev, 
      title:note.title,
      content:note.content!==null?note.content:"",
      category_id:note.category_id
      
    }))
    setDataInit(true)
   }else if(note==null&& updete==false){
    setDataInit(true)
   }
}, [note])
const chengeHendler=(e:ChangeEvent<HTMLTextAreaElement|HTMLInputElement|HTMLSelectElement>)=>{
  const {name, value} =e.target
  
  let val=name=="category_id"?parseInt(value):value

  if(dataInit){

      setForm_data(prev=>({
        ...prev, 
        
        [name]:val
      }))
    
  }else{
   if(note!=null){
    setForm_data(prev=>({
      ...prev, 
      title:note.title,
      content:note.content!==null?note.content:"",
      category_id:note.category_id
      
    }))
    setDataInit(true)
   }
 }

      // setForm_data(prev=>({
      //   ...prev, 
        
      // [name]:val
      // }))
      
      
    }

 

    const [selected_catrgory,serTselected_catrgory ] = useState(String(last_category_index))
  const addORupdate=async()=>{
    console.log(form_data)
    if(form_data.title!=""&& form_data.content!=""){
    if(updete==false){
      console.log('add_note')
        await invoke('add_note',{title:form_data.title, 
          content:form_data.content, 
          categoryId:parseInt(selected_catrgory)==form_data.category_id?form_data.category_id:parseInt(selected_catrgory),
        }
      );
    
      localStorage.setItem("rerender_notes", "true")
      localStorage.setItem("rerender_notes_meneger", "true")
  


      console.log(last_note_id)

    }else{
    console.log('update_note')
      await invoke('update_note', {title:form_data.title, 
        content:form_data.content, 
        categoryId:parseInt(selected_catrgory)==form_data.category_id?form_data.category_id:parseInt(selected_catrgory),
        noteId:note?.id
      }
      
    );
    localStorage.setItem("rerender_notes", "true")
  
  }
}else{
  alert("Пожалуйста, заполните все поля")
}
  }

const chengeHendlerSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
  serTselected_catrgory(event.target.value);
  setForm_data(prev=>({
...prev,
category_id:parseInt(selected_catrgory)


  }))
  console.log(selected_catrgory)
};
   const select_list = categorys.map(category=>{
    return  <option  key={category.id} value={category.id}>{category.name} </option>
   })
 const select_elem = <select name="category_id" onChange={chengeHendlerSelect} value={selected_catrgory}>
 {select_list}
</select>

return(
    <div className="page_note_detels">

<div className="">
 <input type="text"  name="title" value={form_data.title} onChange={chengeHendler}/>
{select_elem}
<button onClick={async()=>{ await addORupdate()}} >{updete==true?"изменить":"саздать"}</button>
{categorys.map(category=>{
  if(category.id==String(form_data.category_id)){

   return  <p>изночальная категория  {category.name}</p>
  }
})}
</div>
<textarea name="content"value={form_data.content as string}  onChange={chengeHendler}id="" className="textarea_content_notes"></textarea>
    </div>

    
)
}