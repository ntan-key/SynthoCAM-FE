import { useEffect, useState } from "react"
import { useWebSocket } from "./WebSocketContext";


const Stats = () => {
    // JS goes here
    const [temperature, setTemperature] = useState(20);
    const [cpu, setCpu] = useState(60);
    const [storage, setStorage] = useState(125);
    const [totalStorage, setTotalStorage] = useState(255);

    const { message } = useWebSocket();

    useEffect(() => {
        setTemperature(message["cpu_temp"])
        setCpu(message["cpu_use"])
        setStorage(Math.round(message["store_use"] / (10**9)*10)/10)
        setTotalStorage(Math.round(message["store_tot"] / (10**9)*10)/10)
    }, [message]);

    return (
        <div className='absolute inset-0 flex pointer-events-none p-3'>
            {/* HTML goes here */}
            <div className="flex text-white text-xs text-left">
                <ul>
                    <li><h1 className="font-bold text-sm">Remote Stats</h1></li>
                    <li>IP: 192.168.0.131</li>
                    <li>CPU Temp: {temperature} °C</li>
                    <li>CPU Usage: {cpu} %</li>
                    <li>Storage Usage: {storage}/{totalStorage} GB</li>
                </ul>
            </div>
        </div>
    )
}

export default Stats