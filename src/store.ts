import { configureStore } from "@reduxjs/toolkit";
import folder_list_slice from'./features/main_window/folders/folder_listSlice'
import app_list_slice from'./features/main_window/apps/app_listSlice'
import notes_list_slice from'./features/main_window/notes/notes_listSlice'
import app_grubs_list_slice from './features/grubs_meneger_window/slice_store/app_grubs_Sclice'
import folder_grubs_list_slice from './features/grubs_meneger_window/slice_store/folder_grubs_Sclice'
import notes_Grub_list_Slice from './features/grubs_meneger_window/slice_store/note_grubs_Sclice'
import select_elements_list_Sclice from './features/grubs_meneger_window/slice_store/select_elements_Sclice'
export const store = configureStore({
    reducer:{
   notes_list:notes_list_slice,
   folders_list:folder_list_slice,
   apps_list:app_list_slice, 
   app_grubs_list:app_grubs_list_slice,
   folder_grubs_list:folder_grubs_list_slice,
   notes_Grub_list:notes_Grub_list_Slice, 
   select_elements_list:select_elements_list_Sclice


    }
})
export type AppDispatch = typeof store.dispatch;
console.log(store.getState())
