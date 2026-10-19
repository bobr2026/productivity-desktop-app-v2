import { useEffect } from "react";
import  {openWindow} from "../../servis";
import Apps_list from "./apps/app_list";
import Folder_list from "./folders/folder_list";
import Note_list from "./notes/Note_list";
import { getCurrentWindow} from '@tauri-apps/api/window';
import { register } from "@tauri-apps/plugin-global-shortcut";


// import Apps_list from "./apps/app_list";
// import Folder_list from "./folders/folder_list";
// import Note_list from "./notes/Note_list";





function Main_window() { 
  console.log(getCurrentWindow())
  async function registorHotkey(){
    await register("Alt+Q", async()=>{
   await getCurrentWindow().setAlwaysOnTop(true)
    console.log("alt+q")
    })
  }
   registorHotkey()
  



 return(
  <div className="8780">


<button onClick={()=>{openWindow("/note_detels","note_detels", 600, 800),  console.log('клик')}}> notes</button>
<button onClick={()=>{openWindow("/grubs_and_category_meneger","grubs_and_category_meneger", 600, 800),  console.log('клик')}}> grubs </button>
<button onClick={()=>{openWindow("/add_folder","add_folder_win", 400, 450),  console.log('клик')}}> folders</button>
<button onClick={()=>{openWindow("/add_app","add_app_win", 400,450 ),  console.log('клик')}}> apps</button>
  <div className="page">


   <Apps_list/>
   <Folder_list/>
    <Note_list/>
  


  </div>
  </div>
 )
}

export default Main_window;