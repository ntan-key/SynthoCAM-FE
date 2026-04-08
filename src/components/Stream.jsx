import { useContext, useEffect } from 'react';
import { AppContext } from "./AppContext";


const Stream = () => {
    // JS goes here
    const { videoRef, audioRef } = useContext(AppContext);


    return (
        <>
            <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover transition-opacity duration-500 opacity-100 rounded-xl`}
                />   
            <audio ref={audioRef} autoPlay id='audio-element'/>
        </>     
    )
}

export default Stream;