import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from "./AppContext";
import Toolbar from './Toolbar';
import Stats from './Stats';


const Stream = () => {
    // JS goes here
    const { videoRef, audioRef } = useContext(AppContext);
    const containerRef = useRef(null);
    const [fullScreen, setFullScreen] = useState(false);
    const audioElement = document.getElementById('audio-element');


    const onFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        else {
            containerRef.current.requestFullscreen();
        }
        setFullScreen(!fullScreen);
    }


    return (
        <div className="border border-border rounded-xl h-full w-full flex flex-col flex-1 justify-center items-center">
            <div ref={containerRef} className='w-full h-full relative'>
                <Stats></Stats>
                <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className={`h-full w-full object-cover transition-opacity duration-500 opacity-100 rounded-xl`}
                    />   
                <Toolbar fullScreen={fullScreen} setFullScreen={setFullScreen} onFullScreen={onFullScreen}></Toolbar>
            </div>     
        </div>     
    )
}

export default Stream;