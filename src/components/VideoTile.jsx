import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react';
import Download from '../assets/download.png';
import Delete from '../assets/delete.png';
        

const VideoTile = () => {
    // JS goes here
    const op = useRef(null);
    return (
        <div className='flex gap-2'>
            <Button>
                <div className='flex flex-col'>
                    <div className='bg-bg-mid h-30 w-50 rounded-md'></div>
                    <h1 className='text-white text-sm text-left'>Video Title.mp4</h1>
                </div>
            </Button>
        <Button className='text-white h-min' style={{lineHeight: 0.8 }} onClick={(e) => op.current.toggle(e)}>...</Button>
        <OverlayPanel ref={op} className='bg-white rounded-sm'>
            <ul className='flex flex-col gap-1'>
                <li>
                    <Button className='flex gap-2 p-2 rounded-sm hover:bg-gray-200'>
                        <img src={Download} alt="Download icon" className='h-5'/>
                        <div>Download</div>
                    </Button>
                </li>
                <li>
                    <Button className='flex gap-2 p-2 rounded-sm hover:bg-gray-200 w-full'>
                        <img src={Delete} alt="Delete icon" className='h-5'/>
                        <div>Delete</div>
                    </Button>
                </li>
            </ul>
        </OverlayPanel>
    </div>
    )
}

export default VideoTile