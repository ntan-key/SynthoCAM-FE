import { useContext, useEffect, useState } from 'react';
import { AppContext } from "./AppContext";


const Stream = () => {
    // JS goes here
    const { videoRef, audioRef } = useContext(AppContext);
    // const audioElement = document.getElementById('audio-element');
    // const [ volume, setVolume ] = useState(0.1);

    // useEffect(() => {
    //     if (audioElement) {
    //         audioElement.volume = volume
    //         audioRef.current.volume = volume
    //     }
    // }, [volume])


    return (
        <>
            <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className={`w-full h-full object-cover transition-opacity duration-500 opacity-100 rounded-xl`}
                />   
            <audio ref={audioRef} autoPlay playsInline id='audio-element'/>
        </>     
    )
}

export default Stream;