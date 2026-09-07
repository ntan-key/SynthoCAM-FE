import { useEffect, useState, useContext } from "react"
import { AppContext } from "./AppContext";


const Stats = () => {
    // JS goes here
    const [temperature, setTemperature] = useState(20);
    const [cpu, setCpu] = useState(60);
    const [storage, setStorage] = useState(125);
    const [totalStorage, setTotalStorage] = useState(255);
    const [cameraStatus, setCameraStatus] = useState("disconnected");
    const [microphoneStatus, setMicrophoneStatus] = useState("disconnected");
         
    const { ip, remoteStatsState } = useContext(AppContext);
    const [remoteStats, setRemoteStats] = remoteStatsState;
    const [videoLag, setVideoLag] = useState(0);
    const [captureTs, setCaptureTs] = useState(0);
    const [displayLag, setDisplayLag] = useState(0);

    // tempory to debug the tablet / device date/time formats
    const [tabletNow, setTabletNow] = useState(0);


    useEffect(() => {
        if (remoteStats !== null) {
            setTemperature(remoteStats["cpu_temp"])
            setCpu(remoteStats["cpu_usage"])
            setStorage(Math.round(remoteStats["storage_used"] / (10**9)*10)/10)
            setTotalStorage(Math.round(remoteStats["storage_total"] / (10**9)*10)/10)
            setCameraStatus(remoteStats["camera_status"])
            setMicrophoneStatus(remoteStats["microphone_status"])
            setVideoLag(remoteStats["video_frame_age_ms"])
            setVideoLag(remoteStats["video_frame_age_ms"] ?? 0)
            setCaptureTs(remoteStats["latest_capture_ts_ms"] ?? 0)
        }
    }, [remoteStats]);

    useEffect(() => {
        if (!captureTs) return;
    
        const updateLag = () => {
            setDisplayLag(Math.round(Date.now() - captureTs));
        };
    
        updateLag();
        const id = setInterval(updateLag, 200);
        return () => clearInterval(id);
    }, [captureTs]);
    
    // Utility debug a devices date/time format for lag display..
    useEffect(() => {
        const id = setInterval(() => {
            setTabletNow(Date.now());
        }, 500);
    
        return () => clearInterval(id);
    }, []);

    return (
        <div className='absolute inset-0 flex pointer-events-none p-3'>
            {/* HTML goes here */}
            <div className="flex text-white text-xs text-left">
                <ul>
                    <li><h1 className="font-bold text-sm">Remote Stats</h1></li>
                    <li>IP: {ip}</li>
                    <li>CPU Temp: {temperature} °C</li>
                    <li>CPU Usage: {cpu} %</li>
                    <li>Storage Usage: {storage}/{totalStorage} GB</li>
                    <li>Camera Status: {cameraStatus}</li>
                    <li>Microphone Status: {microphoneStatus}</li>
                    {/* <li>Video Backend Lag: {videoLag} ms</li>
                    <li>Estimated Total Lag: {displayLag} ms</li>
                    <li>Capture TS: {captureTs}</li>
                    <li>Tablet Now: {tabletNow}</li>
                    <li>Raw Diff: {tabletNow - captureTs} ms</li> */}
                </ul>
            </div>
        </div>
    )
}

export default Stats