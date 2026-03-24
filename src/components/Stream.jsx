import Camera from '../assets/camera.png'
import Toolbar from './Toolbar'
import Stats from './Stats'
import FileManager from './FileManager';

import { useEffect, useRef } from 'react';

import { InputText } from 'primereact/inputtext';
        

const Stream = () => {
    // JS goes here

    const RPI_IP = '192.168.0.131';
    const WEBSOCKET_PORT = 5927;

    const webSocketRef = useRef(null);

    const connectStream = async () => {
        try{
            const ws = new WebSocket(`ws://${RPI_IP}:${WEBSOCKET_PORT}`);
            webSocketRef.current = ws;

            ws.onopen = async () => {
                console.log('ws connected')
            }
            ws.onmessage = async (event) => {
                const data = JSON.parse(event.data);
                if (data.type == 'test'){
                    console.log(data.data)
                }
                // await handleSignalingMessage(data);
            };
        } catch (error)  {
            console.log(`Failed to connect: ${error.message}`);
        }
    }

    const send_message = (msg) => {
        if (webSocketRef.current?.readyState == WebSocket.OPEN) {
                webSocketRef.current.send(JSON.stringify(msg));
        }
    }

    const ping = () => {
        let msg = {type: 'test', data: 'ping'};
        send_message(msg)
    }

    useEffect(() => {
        connectStream();
        // let mssg = {type: 'test', data: 'ping'};
        // webSocketRef.current.send(mssg);
    }, [])
    return (
        <div className='flex flex-1 overflow-hidden'>
            <div className="flex flex-col flex-1 items-center justify-center gap-1 p-5">
                {/* HTML goes here */}
                <div className="bg-black border border-border rounded-xl h-full w-full flex flex-col flex-1 justify-center items-center">
                    <div className='w-full flex flex-row justify-end'>
                        <Stats></Stats>
                    </div>
                    <div className='flex flex-col flex-1 justify-center items-center'>
                        <img src={Camera} alt="Video camera" className='w-20'/>
                        <h1 className="text-gray-300 font-bold text-lg">No Stream Connected</h1>
                        <h2 className='text-gray-500 text-sm'>Press Live button to connect...</h2>
                    </div>
                    <Toolbar></Toolbar>
                </div>
                <InputText type='text' placeholder='Video Title.mp4' className='w-full p-1 rounded-sm border border-border text-white font-bold text-lg'></InputText>
            </div>
            <FileManager></FileManager>
            <button className='bg-white w-10' onClick={ping}>Ping</button>
        </div>
        
        
    )
}

export default Stream