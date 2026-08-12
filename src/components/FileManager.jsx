import VideoTile from './VideoTile';
import { AppContext } from './AppContext';
import { useContext, useEffect, useState } from 'react';


const FileManager = () => {
    const { ip, port, wsStatusState, fileListState } = useContext(AppContext);
    const [ wsStatus, setWsStatus ] = wsStatusState;
    const [ fileList, setFileList ] = fileListState;


    const get_capture_list = async() => {
        fetch(`/api/capture/list`)
        // returns list of titles and thumbnails for all videos listed in the captures folder
        .then((res) => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then((data) => {
            console.log(data)
            setFileList(data['capture_list'])
        })
        .catch((error) => {
            console.error("Error fetching status:", error)
        })
    }


    const send_delete = async(title) => {
        const res = await fetch(`/api/capture/delete`, {
            // request delete capture with title
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title
            }),
        });
        const data = await res.json()
        // await response
        if (data.status == 'ok'){
            setFileList(fileList.filter(item => item.title !== title))
            // remove from frontend file list if deleted successfully
            console.log('video deleted')
        }
    }


    useEffect(() => {
        if (wsStatus == 1){
            get_capture_list();
        }
    }, [wsStatus])


    return (
            <div className='portrait:flex-1 flex flex-col w-full landscape:w-1/5 shrink-0 portrait:h-[35dvh] landscape:h-full p-3 border-x border-border overflow-y-auto gap-3'>
            {/* portrait: flex-1 needed so in portrait the file manager takes up the remainder of the space, not the stream */}
                {fileList.map((item, i) => (
                    <VideoTile key={i} title={item.title} onDelete={send_delete} thumbnail={item.thumbnail}/>
                ))}
            </div>
    )
}

export default FileManager;