import { createSlice,PayloadAction,  } from "@reduxjs/toolkit";

import {   I_all_select_elments, select_elements_list_store, 
    
} from "../../../global_store_types";

const initialState:select_elements_list_store={
select_element:[]
}

const select_elements_list_Sclice= createSlice({
    name:'select_elements_list',
    initialState:initialState,
    reducers:{
        add_select_element:(state:select_elements_list_store, action:PayloadAction<I_all_select_elments>)=>{
       state.select_element.push(action.payload)
        },
        delete_select_element:(state:select_elements_list_store, action:PayloadAction<number>)=>{
            state.select_element.filter(folder=>folder.elemnt_id!=action.payload)
        },
        reset_select_element:(state:select_elements_list_store)=>{
            state.select_element=[]
        },
        // update_select_element:(state:select_elements_list_store, action:PayloadAction<I_all_select_elments>)=>{
        //     state.select_element.forEach(folder=>{
        //         if(folder.elemnt_id==action.payload.elemnt_id){
        //             folder =action.payload
        //         }
                
        //     })
        // }


    },
    

})
export const { add_select_element, delete_select_element, reset_select_element} =select_elements_list_Sclice.actions;
export default select_elements_list_Sclice.reducer