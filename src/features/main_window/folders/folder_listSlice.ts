import { createSlice,PayloadAction,  createAsyncThunk } from "@reduxjs/toolkit";
import { IFolder } from "./folder_types";
import { invoke } from "@tauri-apps/api/core";
import { folder_list_state } from "../../../global_store_types";

const initialState:folder_list_state={
folders:[],
error:null,
louding:false, 
}
export const get_folders_from_db= createAsyncThunk("folder_list/get_folders_from_db", async()=>{
   const folders:IFolder[]= await invoke("get_all_folders")
   return folders

})
export const get_all_foldersBy_GrubId_from_db= createAsyncThunk("folder_list/get_all_foldersBy_GrubId_from_db", async(grub_Id:number)=>{
    const folders:IFolder[]= await invoke("get_all_foldersByGrub_id", {grubId:grub_Id})
    return folders
 
 })
const folder_list_slice= createSlice({
    name:'folder_list',
    initialState:initialState,
    reducers:{
        add_folder:(state:folder_list_state, action:PayloadAction<IFolder>)=>{
       state.folders.push(action.payload)
        },
        delete_folder:(state:folder_list_state, action:PayloadAction<number>)=>{
            state.folders.filter(folder=>folder.id!=action.payload)
        },
        update_folder:(state:folder_list_state, action:PayloadAction<IFolder>)=>{
            state.folders.forEach(folder=>{
                if(folder.id==action.payload.id){
                    folder =action.payload
                }
                
            })
        }


    },
    extraReducers(builder) {
    builder.addCase(get_folders_from_db.pending,state=>{
        state.louding= true
        state.error= null

    })  ,
    builder.addCase(get_folders_from_db.fulfilled,(state, action:PayloadAction<IFolder[]>)=>{
        state.louding= false
        state.error= null
        state.folders= action.payload
        
    })  ,
    builder.addCase(get_folders_from_db.rejected,(state, )=>{
        state.louding= false
        state.error="error"

    })  

    builder.addCase(get_all_foldersBy_GrubId_from_db.pending,state=>{
        state.louding= true
        state.error= null

    })  ,
    builder.addCase(get_all_foldersBy_GrubId_from_db.fulfilled,(state, action:PayloadAction<IFolder[]>)=>{
        state.louding= false
        state.error= null
        state.folders= action.payload
        
    })  ,
    builder.addCase(get_all_foldersBy_GrubId_from_db.rejected,(state, )=>{
        state.louding= false
        state.error="error"

    })  
    }
    

})
export const { update_folder, add_folder, delete_folder,  } =folder_list_slice.actions;
export default folder_list_slice.reducer