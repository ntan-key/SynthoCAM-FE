import { WebSocketProvider } from "./components/WebSocketContext";
import Navbar from "./components/Navbar"
import Stats from "./components/Stats";
import Toolbar from "./components/Toolbar";
import FileManager from "./components/FileManager";
import Stream from "./components/Stream";
import FilenameInput from "./components/FilenameInput";
import AudioSpectrum from "./components/AudioSpectrum";

import { AppContextProvider } from "./components/AppContext";


function App() {

  const RPI_IP = '192.168.0.131';
  const WEBSOCKET_PORT = 8000;  // 5173


  return (
    <AppContextProvider ip={RPI_IP} port={WEBSOCKET_PORT}>
      <div className="h-screen min-w-screen flex flex-col bg-linear-to-r from-bg-start via-bg-mid to-bg-stop">
        <Navbar></Navbar>
        <div className='flex flex-1 overflow-hidden flex-wrap justify-center'>
          <div className="flex flex-col flex-1 items-center justify-center gap-1 p-5">
            <div className="border border-border rounded-xl h-full w-full flex flex-col flex-1 justify-center items-center">
              <div className='w-full h-full relative'>
                <Stats></Stats>
                <Stream></Stream>
                <Toolbar></Toolbar>
              </div>
            </div>
            <FilenameInput></FilenameInput>
            {/* <AudioSpectrum></AudioSpectrum> */}
          </div>
          <FileManager></FileManager>
        </div> 
      </div>
    </AppContextProvider>
  )
}

export default App

// npm run dev -- --host