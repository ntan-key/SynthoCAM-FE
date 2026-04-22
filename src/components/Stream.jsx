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
        <div className="border border-border rounded-xl flex flex-col flex-1 min-h-0 overflow-hidden">
            <div ref={containerRef} className='relative flex-1 min-h-0'>
                <Stats></Stats>
                <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`w-full h-full object-cover transition-opacity duration-500 opacity-100 rounded-xl`}
                    />   
                <Toolbar fullScreen={fullScreen} setFullScreen={setFullScreen} onFullScreen={onFullScreen}></Toolbar>
            </div>     
        </div>     
    )
}

export default Stream;