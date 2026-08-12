import { OverlayPanel } from 'primereact/overlaypanel';
import Download from '../assets/download.png';
import Delete from '../assets/delete.png';
import { AppContext } from './AppContext';

import { useRef, useContext, useEffect } from 'react';


const VideoTile = ({title, onDelete, thumbnail}) => {
    // JS goes here
    const { ip, port } = useContext(AppContext);
    const op = useRef(null);


    const send_download = async() => {
        window.location.href = `/api/capture/download?title=${encodeURIComponent(title)}`;
    }


    const download_button_press = (e) => {
        console.log(`download button pressed: ${title}`);
        op.current.toggle(e);
        send_download();
    }


    const delete_button_press = (e) => {
        console.log(`delete button pressed: ${title}`);
        op.current.toggle(e);
        onDelete(title);
    }


    return (
        <div className='flex gap-2 justify-center'>
            <button className='w-full'>
                <div className='flex flex-col'>
                    <div className='bg-bg-mid aspect-video rounded-md'>
                        <img src={`data:image/jpg;base64,${thumbnail}`} alt="video thumbnail" className='rounded-md w-full h-full'/>
                    </div>
                    <h1 className='text-white text-sm text-left'>{title}</h1>
                </div>
            </button>
            <button className='text-white h-min' style={{lineHeight: 0.8 }} onClick={(e) => op.current.toggle(e)}>...</button>
            <OverlayPanel ref={op} className='bg-white rounded-sm'>
                <ul className='flex flex-col gap-1'>
                    <li>
                        <button className='flex gap-2 p-2 rounded-sm hover:bg-gray-200' onClick={download_button_press}>
                            <img src={Download} alt="Download icon" className='h-5'/>
                            <div>Download</div>
                        </button>
                    </li>
                    <li>
                        <button className='flex gap-2 p-2 rounded-sm hover:bg-gray-200 w-full' onClick={delete_button_press}>
                            <img src={Delete} alt="Delete icon" className='h-5'/>
                            <div>Delete</div>
                        </button>
                    </li>
                </ul>
            </OverlayPanel>
        </div>
    )
}

export default VideoTile