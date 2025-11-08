import { createSlice,PayloadAction,  createAsyncThunk } from "@reduxjs/toolkit";
import { INote } from "./note_types";
import { invoke } from "@tauri-apps/api/core";
import { notes_list_state } from "../../../global_store_types";

const initialState:notes_list_state={
notes:[],
error:null,
louding:false, 
last_note_id:-1
}
export const get_notes_from_db= createAsyncThunk("notes_list/get_notes_from_db", async()=>{
   const folders:INote[]= await invoke("get_all_notes")
   return folders

})
export const get_all_notes_by_category_id= createAsyncThunk("notes_list/get_all_notes_by_category_id", async(category_id:number)=>{
    const folders:INote[]= await invoke("get_all_notesByCategory_id", {categoryId:category_id})
    return folders
 
 })

//  builder.addCase(get_all_notes_by_category_id.pending,state=>{
//     state.louding= true
//     state.error= null

// })  ,
// builder.addCase(get_all_notes_by_category_id.fulfilled,(state, action:PayloadAction<INote[]>)=>{
//     state.louding= false
//     state.error= null
//     state.notes= action.payload
    
// })  ,
// builder.addCase(get_all_notes_by_category_id.rejected,(state, )=>{
//     state.louding= false
//     state.error="error"

// })  
const notes_list_slice= createSlice({
    name:'notes_list',
    initialState:initialState,
    reducers:{
        add_notes:(state:notes_list_state, action:PayloadAction<INote>)=>{
       state.notes.push(action.payload)
        },
        delete_notes:(state:notes_list_state, action:PayloadAction<number>)=>{
            state.notes.filter(folder=>folder.id!=action.payload)
        },
        update_notes:(state:notes_list_state, action:PayloadAction<INote>)=>{
            state.notes.forEach(folder=>{
                if(folder.id==action.payload.id){
                    folder =action.payload
                }
                
            })

        }, 
        select_last_note_id:(state:notes_list_state, action:PayloadAction<number>)=>{
          state.last_note_id+=action.payload
             },
             reset_last_note_id:(state:notes_list_state,)=>{
                state.last_note_id=-1
                   },


    },
    extraReducers(builder) {
    builder.addCase(get_notes_from_db.pending,state=>{
        state.louding= true
        state.error= null

    })  ,
    builder.addCase(get_notes_from_db.fulfilled,(state, action:PayloadAction<INote[]>)=>{
        state.louding= false
        state.error= null
        state.notes= action.payload
        
    })  ,
    builder.addCase(get_notes_from_db.rejected,(state, )=>{
        state.louding= false
        state.error="error"

    })  

 builder.addCase(get_all_notes_by_category_id.pending,state=>{
    state.louding= true
    state.error= null

})  ,
builder.addCase(get_all_notes_by_category_id.fulfilled,(state, action:PayloadAction<INote[]>)=>{
    state.louding= false
    state.error= null
    state.notes= action.payload
    
})  ,
builder.addCase(get_all_notes_by_category_id.rejected,(state, )=>{
    state.louding= false
    state.error="error"

})  
  




    }
   
    

})
export const { update_notes, add_notes, delete_notes, select_last_note_id, reset_last_note_id } =notes_list_slice.actions;
export default notes_list_slice.reducer