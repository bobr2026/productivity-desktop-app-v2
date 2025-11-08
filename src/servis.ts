import { invoke } from "@tauri-apps/api/core";

async function restartApp() {
    try {
        await invoke('restart_app');
        console.log('Application restarted successfully!');
    } catch (error) {
        console.error('Failed to restart application:', error);
    }
}
export default restartApp
import { WebviewWindow, } from '@tauri-apps/api/webviewWindow'

 import {} from"@tauri-apps/api/window"


  export const openWindow = async(path: string, label: string, height:number, width:number,decoration?:boolean, ) => {
  // const uniqueLabel = label || `window-${Date.now()}`; // или любой другой способ
 const win= new WebviewWindow(label, {
    // url: `/${path}`, // Например, "/about"
  
  url:`index.html#${path}`,

    width: width,
    height: height,
    decorations:decoration!=null?false:true
    

  }
  
  
);
win.once("tauri://window-created", async()=>{


  
}); 

  console.log("создано новое окно ")

win.once('tauri://error', (error) => {
    console.error('Error creating second window:', error);




})
  }
import { relaunch } from '@tauri-apps/plugin-process';

export const restartFrontend=async()=> {
  await relaunch();
} 


export async function openApp(path: string) {
  try {
      await invoke('open_app', { appPath: path });
      
      
  } catch (error) {
      console.error('Failed to open folder:', error);
  }
}
