import VideoTile from './VideoTile';
import { AppContext } from './AppContext';
import { useContext, useEffect, useState } from 'react';


const FileManager = () => {
    // JS goes here
    const { ip, port, wsStatusState, fileListState } = useContext(AppContext);
    const [ wsStatus, setWsStatus ] = wsStatusState;
    const [ fileList, setFileList ] = fileListState;


    const get_capture_list = async() => {
        // fetch(`https://${ip}:${port}/capture/list`)
        fetch(`/api/capture/list`)
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
        // const res = await fetch(`https://${ip}:${port}/capture/delete`, {
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
        if (data.status == 'ok'){
            setFileList(fileList.filter(item => item.title !== title))
            console.log('video deleted')
        }
    }


    useEffect(() => {
        if (wsStatus == 1){
            get_capture_list();
        }
    }, [wsStatus])


    return (
            <div className='flex flex-col w-full landscape:w-1/5 shrink-0 portrait:h-[35dvh] landscape:h-full border-x border-border p-5 overflow-y-auto gap-3'>
            {/* <div className='flex flex-col w-full md:w-1/5 shrink-0 h-[35dvh] md:h-auto border-x border-border p-5 overflow-y-auto gap-3'> */}
                {fileList.map((item, i) => (
                    <VideoTile key={i} title={item.title} onDelete={send_delete} thumbnail={item.thumbnail}/>
                ))}
            </div>
    )
}

export default FileManager;