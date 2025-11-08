import { createSlice,PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { IApp } from "./app_types";
import { invoke } from "@tauri-apps/api/core";
import { app_list_state } from "../../../global_store_types";

const initialState:app_list_state={
apps:[],
error:null,
louding:false, 
}
export const get_apps_from_db= createAsyncThunk("apps_list/get_apps_from_db", async()=>{
   const folders:IApp[]= await invoke("get_all_apps")
   return folders

})

export const get_all_appsByGrub_id= createAsyncThunk("notes_list/get_all_appsByGrub_id", async(grubId:number)=>{
    const folders:IApp[]= await invoke("get_all_appsByGrub_id", {grubId:grubId})
    return folders
 
 })

const app_list_slice= createSlice({
    name:'apps_list',
    initialState:initialState,
    reducers:{
        add_app:(state:app_list_state, action:PayloadAction<IApp>)=>{
       state.apps.push(action.payload)
        },
        delete_app:(state:app_list_state, action:PayloadAction<number>)=>{
            state.apps.filter(folder=>folder.id!=action.payload)
        },
        update_app:(state:app_list_state, action:PayloadAction<IApp>)=>{
            state.apps.forEach(folder=>{
                if(folder.id==action.payload.id){
                    folder =action.payload
                }
                
            })
        }


    },
    extraReducers(builder) {
    builder.addCase(get_apps_from_db.pending,state=>{
        state.louding= true
        state.error= null

    })  ,
    builder.addCase(get_apps_from_db.fulfilled,(state, action:PayloadAction<IApp[]>)=>{
        state.louding= false
        state.error= null
        state.apps= action.payload
        
    })  ,
    builder.addCase(get_apps_from_db.rejected,(state)=>{
        state.louding= false
        state.error="error"

    })

    builder.addCase(get_all_appsByGrub_id.pending,state=>{
        state.louding= true
        state.error= null

    })  ,
    builder.addCase(get_all_appsByGrub_id.fulfilled,(state, action:PayloadAction<IApp[]>)=>{
        state.louding= false
        state.error= null
        state.apps= action.payload
        
    })  ,
    builder.addCase(get_all_appsByGrub_id.rejected,(state)=>{
        state.louding= false
        state.error="error"

    })  
    }
    

})
export const { update_app, add_app, delete_app,  } =app_list_slice.actions;
export default app_list_slice.reducer