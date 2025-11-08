
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
// import Note_list from "./features/main_window/notes/Note_list";
// import Folder_list from "./features/main_window/folders/folder_list";
// import { invoke } from "@tauri-apps/api/core";
import { RouterProvider, createHashRouter} from "react-router-dom"
import Main_window from "./features/main_window/main_win";
// import Test_window from "./features/test_window/test_win";
import Note_detels from "./features/main_window/notes/note_detels";
import Grub_meneger_win from "./features/grubs_meneger_window/grub_meneger_win";
import Add_folder_win from "./features/main_window/folders/add_folders.";
import Add_app__win from "./features/main_window/apps/add_app";


const router = createHashRouter([{
  path:"/", index:true,  element:<Main_window/>}, { path:"/note_detels", element:<Note_detels/>},
{path:"/note_detels/:note_id",element:<Note_detels/>}, {path:"/grubs_and_category_meneger",element:<Grub_meneger_win/>},
{path:"/add_folder",element:<Add_folder_win/>},
{path:"/grubs_and_category_meneger",element:<Grub_meneger_win/>},
{path:"/add_app", element:<Add_app__win/>}

]
) 
function App(){
return <RouterProvider router={router}/>  
}

export default App
// async function createNote() {
//   try {
//     await invoke('add_note', { title: 'My Note', content: 'Note content', category_id: 1 });
//     console.log("Note added");
//   } catch (e) {
//     console.error(e);
//   }
// }


// function App() {




//  return(
//   <div className="page">
//     <Folder_list/>
//     <Note_list/>
//   </div>
//  )
// }

// export default App;
