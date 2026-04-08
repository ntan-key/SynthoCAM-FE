import Record from '../assets/record.png'
import Stop from '../assets/stop.png'
import Play from '../assets/play.png'
import Volume from '../assets/volume.png'
import Mute from '../assets/mute.png'
import Maximise from '../assets/maximise.png'
import Minimise from '../assets/minimise.png'

import { AppContext } from './AppContext'

import { useState, useEffect, useRef, useContext } from 'react'

const FILE_EXTENSION = '.avi';


const Toolbar = () => {
    // JS goes here
    const { wsRef, recordState, filenameState } = useContext(AppContext);
    const [record, setRecord] = recordState;
    const [ filename, setFilename ] = filenameState;
    const [sound, setSound] = useState(true);
    const [maximise, setMaximise] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const [time, setTime] = useState('00:00:00');

    const recordRef = useRef(record);
    const startTimeRef = useRef(startTime);


    const recordButtonPress = () => {
        if (record) {
            console.log('Stop record button pressed toolbar')
            setTime('00:00:00');
            setRecord(false)
            wsRef.current.send(JSON.stringify({
                type: 'recording-end',
            }));
        }
        else {
            console.log('Start record button pressed toolbar')
            let date = new Date();
            let timestamp = `${date.getFullYear()}_${(date.getMonth() + 1 < 10)? `0${date.getMonth() + 1}`: date.getMonth() + 1}_${(date.getDate() < 10)? `0${date.getDate()}`: date.getDate()}_${(date.getHours() < 10)? `0${date.getHours()}`: date.getHours()}_${(date.getMinutes() < 10)? `0${date.getMinutes()}`: date.getMinutes()}_${(date.getSeconds() < 10)? `0${date.getSeconds()}`: date.getSeconds()}`;
            setStartTime(Date.now())
            setRecord(true)
            let filenameFull = (filename==''? `video_${timestamp}` : filename) + FILE_EXTENSION
            wsRef.current.send(JSON.stringify({
                type: 'recording-start',
                filename: filenameFull
            }));
            console.log(filenameFull)
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


    const maxMinButtonPress = () => {
        if (maximise) {
            console.log('Min button pressed')
            setMaximise(false)
        }
        else {
            console.log('Max button pressed')
            setMaximise(true)
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
        <div className='w-full absolute inset-0 flex items-end justify-between p-2'>
            <div className="h-12 w-full flex items-center gap-5">
                <button onClick={recordButtonPress}>
                    <img src={record? Stop : Record} alt="Record button" className='h-8'/>
                </button>
                <button onClick={soundButtonPress}>
                    <img src={sound? Volume : Mute} alt="Volume button" className='h-8'/>
                </button>
                <div className='text-white'>{time}</div>
            </div>
            <button onClick={maxMinButtonPress}>
                <img src={maximise? Minimise : Maximise} alt="Max Min button" className='h-8'/>
            </button>
        </div>
    );
}

export default Toolbar;