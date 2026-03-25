import VideoTile from './VideoTile';
import { useWebSocket } from './WebSocketContext';
import { useEffect } from 'react';

const file_ls = ['video1.mp4', 'video2.mp4', 'video3.mp4', 'video4.mp4', 'video5.mp4', 'video6.mp4']

const FileManager = () => {
    // JS goes here
    // const { message } = useWebSocket();
    // const { sendMessage } = useWebSocket();
    // useEffect(() => {
    //     sendMessage({
    //         type: "file_req",
    //         data: "all"
    //     })
    // }, [])
    return (
            <div className='flex flex-col w-full md:w-70 border-x border-border p-5 overflow-y-scroll h-full gap-3'>
                {file_ls.map((item, i) => (
                    <VideoTile key={i} title={item} />
                ))}
            </div>
    )
}

export default FileManager