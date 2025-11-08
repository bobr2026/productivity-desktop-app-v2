import { IApp } from "./features/main_window/apps/app_types";
import { IFolder } from "./features/main_window/folders/folder_types";
import { INote } from "./features/main_window/notes/note_types";
import {Iapp_grub, Inote_grub, Ifolder_grub} from "./features/grubs_meneger_window/grubs_types"

export interface app_list_state{
    apps:IApp[],
error:null|string,
louding:boolean, 
}
export interface folder_list_state{
    folders:IFolder[],
error:null|string,
louding:boolean, 
}

 export interface notes_list_state{
    notes:INote[],
error:null|string,
louding:boolean, 
last_note_id:number

}

export interface appGrubs_list_state{
    apps_grubs:Iapp_grub[]
    error:null|string,
louding:boolean, 
}
export interface notesGrubs_list_state{
    notes_grubs:Inote_grub[]
    error:null|string,
louding:boolean, 
}
export interface folderGrubs_list_state{
    folders_grubs:Ifolder_grub[]
    error:null|string,
louding:boolean, 
}

export interface select_elements_list_store{
    select_element:I_all_select_elments[]
}

export interface Iglobal_store{
    folders_list:folder_list_state, 
    notes_list:notes_list_state,
    apps_list:app_list_state,
    app_grubs_list:appGrubs_list_state
    folder_grubs_list:folderGrubs_list_state
    notes_Grub_list: notesGrubs_list_state
    select_elements_list:select_elements_list_store

}

export interface I_all_select_elments{
    elemnt_id:number
    type_element:"folder"|"app"|"note"
  }