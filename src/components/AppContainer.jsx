import { useContext } from "react";
import { AppContext } from "./AppContext";

import Navbar from "./Navbar"
import FileManager from "./FileManager";
import Stream from "./Stream";
import FilenameInput from "./FilenameInput";
import AudioSpectrum from "./AudioSpectrum";


const AppContainer = () => {
    const { audioContextRef } = useContext(AppContext);

    const unlockAudio = async () => {
        const ctx = audioContextRef.current;
        if (ctx?.state === "suspended") {
            await ctx.resume();
        }
    };

    return (
        <div className="h-[100dvh] flex flex-col bg-linear-to-r from-bg-start via-bg-mid to-bg-stop" onClick={unlockAudio} onTouchStart={unlockAudio}>
            <Navbar></Navbar>
            <div className='flex flex-1 portrait:flex-col landscape:flex-row overflow-hidden'>
            {/* <div className='flex flex-1 flex-col md:flex-row overflow-hidden'> */}
            <div className="flex flex-1 flex-col min-h-0 gap-2 p-5">
                <Stream></Stream>
                <FilenameInput></FilenameInput>
                <AudioSpectrum></AudioSpectrum>
            </div>
            <FileManager></FileManager>
            </div> 
        </div>
    )
}

export default AppContainer;