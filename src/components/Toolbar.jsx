import Record from '../assets/record.png'
import Stop from '../assets/stop.png'
import Volume from '../assets/volume.png'
import Mute from '../assets/mute.png'
import { Button } from 'primereact/button'
import { useState, useEffect, useRef } from 'react'

const Toolbar = () => {
    // JS goes here

    const [record, setRecord] = useState(false);
    const [sound, setSound] = useState(true);
    const [startTime, setStartTime] = useState(Date.now());
    const [time, setTime] = useState('00:00:00');
    const recordRef = useRef(record);
    const startTimeRef = useRef(startTime);

    const recordButtonPress = () => {
        if (record) {
            console.log('Stop record button pressed')
            setTime('00:00:00');
            setRecord(false)
        }
        else {
            console.log('Start record button pressed')
            setStartTime(Date.now())
            setRecord(true)
        }
    }

    const soundButtonPress = () => {
        if (sound) {
            console.log('Mute button pressed')
            setSound(false)
        }
        else {
            console.log('Sound button pressed')
            setSound(true)
        }
    }

    const formatTime = (msTime) => {
        let sTime = Math.round(msTime / 1000);
        let mTime = Math.floor(sTime / 60);
        let hTime = Math.floor(mTime / 60);

        let seconds = (sTime - (mTime * 60)).toString();
        let minutes = (mTime - (hTime * 60)).toString();
        let hours = hTime.toString();

        seconds = seconds.length < 2 ? `0${seconds}` : seconds;
        minutes = minutes.length < 2 ? `0${minutes}` : minutes;
        hours = hours.length < 2 ? `0${hours}` : hours;

        return `${hours}:${minutes}:${seconds}`;
    };

    useEffect(() => { recordRef.current = record });
    useEffect(() => { startTimeRef.current = startTime });
    useEffect(() => {
        const timer = setInterval(() => {
            if (recordRef.current) {
                setTime(formatTime(Date.now() - startTimeRef.current));
            }
        }, 1);
        return () => {
            clearInterval(timer);
        }
    }, []);

    return (
        <div className="h-12 w-full p-2 flex items-center gap-5">
            <Button onClick={recordButtonPress}>
                <img src={record? Stop : Record} alt="Record button" className='h-8'/>
            </Button>
            <Button onClick={soundButtonPress}>
                <img src={sound? Volume : Mute} alt="Volume button" className='h-8'/>
            </Button>
            <div className='text-white'>{time}</div>
        </div>
    );
}

export default Toolbar;