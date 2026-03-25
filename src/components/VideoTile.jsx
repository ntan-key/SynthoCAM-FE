import { OverlayPanel } from 'primereact/overlaypanel';
import Download from '../assets/download.png';
import Delete from '../assets/delete.png';

import { useRef } from 'react';
        

const VideoTile = ({title}) => {
    // JS goes here
    const op = useRef(null);
    return (
        <div className='flex gap-2 justify-center'>
            <button className='w-full'>
                <div className='flex flex-col'>
                    <div className='bg-bg-mid aspect-video rounded-md'></div>
                    <h1 className='text-white text-sm text-left'>{title}</h1>
                </div>
            </button>
        <button className='text-white h-min' style={{lineHeight: 0.8 }} onClick={(e) => op.current.toggle(e)}>...</button>
        <OverlayPanel ref={op} className='bg-white rounded-sm'>
            <ul className='flex flex-col gap-1'>
                <li>
                    <button className='flex gap-2 p-2 rounded-sm hover:bg-gray-200' onClick={(e) => op.current.toggle(e)}>
                        <img src={Download} alt="Download icon" className='h-5'/>
                        <div>Download</div>
                    </button>
                </li>
                <li>
                    <button className='flex gap-2 p-2 rounded-sm hover:bg-gray-200 w-full' onClick={(e) => op.current.toggle(e)}>
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