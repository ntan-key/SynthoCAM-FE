import { OverlayPanel } from 'primereact/overlaypanel';
import Download from '../assets/download.png';
import Delete from '../assets/delete.png';
import { AppContext } from './AppContext';

import { useRef, useContext, useEffect } from 'react';

        
// Source - https://stackoverflow.com/a/29823632
// Posted by Razor, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-07, License - CC BY-SA 4.0

// (async () => {
//   const rawResponse = await fetch('https://httpbin.org/post', {
//     method: 'POST',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({a: 1, b: 'Textual content'})
//   });
//   const content = await rawResponse.json();

//   console.log(content);
// })();


const VideoTile = ({title, onDelete, thumbnail}) => {
    // JS goes here
    const { ip, port } = useContext(AppContext);
    const op = useRef(null);


    const send_download = async() => {
        window.location.href = `/api/capture/download?title=${encodeURIComponent(title)}`;
        // window.location.href = `https://${ip}:${port}/capture/download?title=${encodeURIComponent(title)}`;
    }


    const download_button_press = (e) => {
        console.log(`download button pressed: ${title}`);
        op.current.toggle(e);
        send_download();
    }


    // const send_delete = async() => {
    //     const res = await fetch(`http://${ip}:${port}/capture/delete`, {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             title: title
    //         }),
    //     });

    //     const data = await res.json()
    //     console.log(data);
    //     // if data.status == 'ok'{console.log('video deleted')}
    // }


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