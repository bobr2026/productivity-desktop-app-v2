

// export default function  Grub_ditals_note({id, title}:INote){

//     return   <div className="grub_ditals_item" key={id} onClick={()=>{openWindow(`/note_detels/${id}`,`note_detels/${id}`, 600, 800)}} onContextMenu={async(e)=>{
//         e.preventDefault();
//         const confirmation = await confirm(
//           'This action cannot be reverted. Are you sure?',
//           { title: 'Tauri', kind: 'warning' }
//         );
//         if(confirmation){
// let rerender= localStorage.getItem('rerender_notes')
//           if(rerender=="false"){
//             await invoke("delete_note", {noteId:id})
            
//             localStorage.setItem("rerender_notes", "true")
//           }
//           set_delete_element(true)
//           dispatch(delete_notes(id))
//         }
//        console.log(confirmation)

              
//       }}>
        
//           <h2>{note.title}</h2><input type="checkbox" />
      

//            </div>
//}