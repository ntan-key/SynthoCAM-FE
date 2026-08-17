import { useContext } from "react";
import { AppContext } from "./AppContext";
import Navbar from "./Navbar";
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

    const gainChange = (e) => {
        sendGain(e.target.value)
    };

    const sendGain = async(gain) => {
        const res = await fetch(`/api/audio/gain`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gain: gain
            }),
        });
        const data = await res.json()
        // await response
        if (data.status == 'ok'){
        }
    }

    return (
        <div
            className="h-[100dvh] w-[100dvw] flex flex-col bg-linear-to-r from-bg-start via-bg-mid to-bg-stop" 
            onClick={unlockAudio} 
            onTouchStart={unlockAudio}
        >
            <Navbar></Navbar>
            <div className='flex flex-1 min-h-0 min-w-0 portrait:flex-col landscape:flex-row overflow-hidden'>
                {/* overflow-hidden needed to make file manager the size of the screen */}
                <div className="flex landscape:flex-1 flex-col min-h-0 min-w-0 gap-2 p-3">
                    {/* landscape:flex-1 needed so container takes up raminder of space in landscape but not portrait */}
                    <Stream></Stream>
                    <div className="flex shrink-0">
                        <FilenameInput></FilenameInput>
                        <div className="flex flex-col items-center">
                            <input type="range" min={1} max={5} step={1} defaultValue={1} onChange={gainChange}/>
                            <p className="text-white">Gain (1-5)</p>
                        </div>
                    </div>
                    <AudioSpectrum></AudioSpectrum>
                </div>
                <FileManager></FileManager>
            </div>
        </div>
    )
}

export default AppContainer;