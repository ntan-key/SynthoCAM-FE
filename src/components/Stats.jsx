import { useState } from "react"

const Stats = () => {
    // JS goes here
    const [temperature, setTemperature] = useState(20);
    const [cpu, setCpu] = useState(60);
    const [storage, setStorage] = useState(125);
    const [totalStorage, setTotalStorage] = useState(255);

    return (
        <div className="p-3 flex justify-end">
            {/* HTML goes here */}
            <div className="flex text-white text-xs text-right">
                <ul>
                    <li><h1 className="font-bold text-sm">Remote Stats</h1></li>
                    <li>IP: 192.168.0.131</li>
                    <li>CPU Temp: {temperature} degrees</li>
                    <li>CPU Usage: {cpu} %</li>
                    <li>Available Storage: {storage}/{totalStorage} GB</li>
                </ul>
            </div>
        </div>
    )
}

export default Stats