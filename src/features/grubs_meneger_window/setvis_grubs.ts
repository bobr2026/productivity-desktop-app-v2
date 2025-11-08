
import { I_all_select_elments} from "../../global_store_types";

import { INote } from "../main_window/notes/note_types";
import { invoke } from "@tauri-apps/api/core";
import { IFolder } from "../main_window/folders/folder_types";
import { IApp } from "../main_window/apps/app_types";

export function get_all_elemets(select_element: I_all_select_elments[], new_grub_elements:number){
    const notes:INote[] =[]
    const folders:IFolder[]=[] 
    const apps:IApp[]=[]

    
    if(select_element.length!=0){
const firs_elem= select_element[0]
        switch (firs_elem.type_element) {
            case "note":
              select_element.map(async elem=>{
                  const note:INote[] =await invoke("update_grub_notes___by_grub_id", {categoryId:new_grub_elements, noteId:elem.elemnt_id, });
                console.log(note)
              })
                
                break;
                case "folder":
                    select_element.map(async elem=>{
                        const note:IFolder[] =await invoke("update_grub_folder___by_grub_id",{folderGrubId:new_grub_elements, folderId:elem.elemnt_id});
                        console.log(note)
                    })
                    break;
    
                case "app":
                    select_element.map( async elem=>{
                        const note:IApp[] =await invoke("update_grub_app__by_app_grub_id",{ appGrubI:new_grub_elements, appId:elem.elemnt_id});
                        console.log(note)
        })
        break;
        }
    }
    console.log([notes, folders, apps])
return [notes, folders, apps]
}


