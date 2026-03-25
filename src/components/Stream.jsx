import Camera from '../assets/camera.png'

import Toolbar from './Toolbar'
import Stats from './Stats'
import FileManager from './FileManager';

import { useWebSocket } from "./WebSocketContext";
import { useEffect } from 'react';


const Stream = () => {
    // JS goes here
    const { remoteAudioRef, remoteVideoRef } = useWebSocket();
    // let audioElement = document.getElementById('audio-element');s
    return (
        <div className='flex flex-1 overflow-hidden flex-wrap justify-center'>
            <div className="flex flex-col flex-1 items-center justify-center gap-1 p-5">
                {/* HTML goes here */}
                <div className="border border-border rounded-xl h-full w-full flex flex-col flex-1 justify-center items-center">
                    <div className='w-full h-full relative'>
                        <Stats></Stats>
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className={`w-full h-full object-cover transition-opacity duration-500 opacity-100 rounded-xl`}
                        />
                        <Toolbar></Toolbar>
                    </div>
                    
                    {/* <div className='w-full flex flex-row'>
                        <Stats></Stats>
                    </div>
                    <div className='flex flex-col flex-1 justify-center items-center'>
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className={`w-full h-full object-contain transition-opacity duration-500 opacity-100`}
                        /> */}
                        {/* <img src={Camera} alt="Video camera" className='w-20'/>
                        <h1 className="text-gray-300 font-bold text-lg">No Stream Connected</h1>
                        <h2 className='text-gray-500 text-sm'>Press Live button to connect...</h2> */}
                    {/* </div> */}
                    {/* <Toolbar></Toolbar> */}
                </div>
                <input type='text' placeholder='Video Title.mp4' className='w-full p-1 rounded-sm border border-border text-white font-bold text-lg'></input>
            </div>
            <FileManager></FileManager>
            <audio ref={remoteAudioRef} autoPlay id='audio-element'/>
        </div>   
    )
}

export default Stream;