import { createSlice,PayloadAction,  createAsyncThunk } from "@reduxjs/toolkit";
import { Iapp_grub } from "../grubs_types";
import { invoke } from "@tauri-apps/api/core";
import { appGrubs_list_state } from "../../../global_store_types";

const initialState:appGrubs_list_state={
    apps_grubs: [],
    error: null,
    louding: false,
}
export const get_apps_grubs_from_db= createAsyncThunk("app_grubs_list/get_apps_grubs_from_db", async()=>{
   const folders:Iapp_grub[]= await invoke("getAllAppsGrub")
   return folders

})
const app_grubs_list_slice= createSlice({
    name:'app_grubs_list',
    initialState:initialState,
    reducers:{
        add_apps_grubs:(state:appGrubs_list_state, action:PayloadAction<Iapp_grub>)=>{
       state.apps_grubs.push(action.payload)
        },
        delete_apps_grubs:(state:appGrubs_list_state, action:PayloadAction<number>)=>{
            state.apps_grubs.filter(folder=>folder.id!=action.payload)
        },
        update_apps_grubs:(state:appGrubs_list_state, action:PayloadAction<Iapp_grub>)=>{
            state.apps_grubs.forEach(folder=>{
                if(folder.id==action.payload.id){
                    folder =action.payload
                }
                
            })
        }


    },
    extraReducers(builder) {
    builder.addCase(get_apps_grubs_from_db.pending,state=>{
        state.louding= true
        state.error= null

    })  ,
    builder.addCase(get_apps_grubs_from_db.fulfilled,(state, action:PayloadAction<Iapp_grub[]>)=>{
        state.louding= false
        state.error= null
        state.apps_grubs= action.payload
        
    })  ,
    builder.addCase(get_apps_grubs_from_db.rejected,(state, )=>{
        state.louding= false
        state.error="error"

    })  
    }
    

})
export const { add_apps_grubs, update_apps_grubs, delete_apps_grubs  } =app_grubs_list_slice.actions;
export default app_grubs_list_slice.reducer