import { createSlice,PayloadAction,  createAsyncThunk } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { folderGrubs_list_state } from "../../../global_store_types"
import { Ifolder_grub } from "../grubs_types"
const initialState:folderGrubs_list_state={
folders_grubs:[],
error:null,
louding:false, 
}
export const get_folder_grubs_from_db= createAsyncThunk("folder_grubs_list/get_folder_grubs_from_db", async()=>{
   const folders:Ifolder_grub[]= await invoke("getAllFoldersGrub")
   return folders

})
const folder_grubs_list_slice= createSlice({
    name:'folder_grubs_list',
    initialState:initialState,
    reducers:{
        add_folder_grubs:(state:folderGrubs_list_state, action:PayloadAction<Ifolder_grub>)=>{
       state.folders_grubs.push(action.payload)
        },
        delete_folder_grubs:(state:folderGrubs_list_state, action:PayloadAction<number>)=>{
            state.folders_grubs.filter(folder=>folder.id!=action.payload)
        },
        update_folder_grubs:(state:folderGrubs_list_state, action:PayloadAction<Ifolder_grub>)=>{
            state.folders_grubs.forEach(folder=>{
                if(folder.id==action.payload.id){
                    folder =action.payload
                }
                
            })
        }


    },
    extraReducers(builder) {
    builder.addCase(get_folder_grubs_from_db.pending,state=>{
        state.louding= true
        state.error= null

    })  ,
    builder.addCase(get_folder_grubs_from_db.fulfilled,(state, action:PayloadAction<Ifolder_grub[]>)=>{
        state.louding= false
        state.error= null
        state.folders_grubs= action.payload
        
    })  ,
    builder.addCase(get_folder_grubs_from_db.rejected,(state, )=>{
        state.louding= false
        state.error="error"

    })  
    }
    

})
export const {update_folder_grubs, add_folder_grubs, delete_folder_grubs  } =folder_grubs_list_slice.actions;
export default folder_grubs_list_slice.reducer