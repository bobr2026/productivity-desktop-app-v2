import { createSlice,PayloadAction,  createAsyncThunk } from "@reduxjs/toolkit";
import { Inote_grub} from "../grubs_types"
import { invoke } from "@tauri-apps/api/core";
import {  notesGrubs_list_state } from "../../../global_store_types";

const initialState:notesGrubs_list_state={
notes_grubs:[],
error:null,
louding:false, 
}
export const get_notes_grubs_from_db= createAsyncThunk("notes_Grub_list/get_notes_grubs_from_db", async()=>{
   const notes_grubs:Inote_grub[]= await invoke("get_all_categories")
   return notes_grubs

})
const notes_Grub_list_Slice= createSlice({
    name:'notes_Grub_list',
    initialState:initialState,
    reducers:{
        add_notesGrub:(state:notesGrubs_list_state, action:PayloadAction<Inote_grub>)=>{
       state.notes_grubs.push(action.payload)
        },
        delete_notesGrub:(state:notesGrubs_list_state, action:PayloadAction<number>)=>{
            state.notes_grubs.filter(folder=>folder.id!=action.payload)
        },
        update_notesGrub:(state:notesGrubs_list_state, action:PayloadAction<Inote_grub>)=>{
            state.notes_grubs.forEach(folder=>{
                if(folder.id==action.payload.id){
                    folder =action.payload
                }
                
            })
        }


    },
    extraReducers(builder) {
    builder.addCase(get_notes_grubs_from_db.pending,state=>{
        state.louding= true
        state.error= null

    })  ,
    builder.addCase(get_notes_grubs_from_db.fulfilled,(state, action:PayloadAction<Inote_grub[]>)=>{
        state.louding= false
        state.error= null
        state.notes_grubs= action.payload
        
    })  ,
    builder.addCase(get_notes_grubs_from_db.rejected,(state, )=>{
        state.louding= false
        state.error="error"

    })  
    }
    

})
export const { add_notesGrub, update_notesGrub,  delete_notesGrub, } =notes_Grub_list_Slice.actions;
export default notes_Grub_list_Slice.reducer