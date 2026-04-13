import Volume from '../assets/volume.png'
import Mute from '../assets/mute.png'
import { useContext, useEffect } from 'react';
import './VolumeButton.css'
import { AppContext } from './AppContext';

const VolumeButton = () => {
    const { muteState, volumeState, gainRef } = useContext(AppContext);
    const [mute, setMute] = muteState;
    const [volume, setVolume] = volumeState;

    
    const soundButtonPress = () => {
        setMute(!mute);
        console.log(mute? 'Unmute' : 'Mute')
    }


    const volumeChange = (e) => {
        console.log(`volume: ${e.target.value}`)
        setVolume(e.target.value)
    }


    useEffect(() => {
        if (gainRef.current){
            if (mute) {
                gainRef.current.gain.value = 0.0;
            }
            else {
                gainRef.current.gain.value = volume / 100;
            }
        }
    }, [mute, volume])

    return (
        <div className='volume-container flex'>
            <button onClick={soundButtonPress}>
                <img src={mute? Mute : Volume} alt="Volume button" className='h-8'/>
            </button>
            <input type="range" className='volume-slider' value={volume} onChange={volumeChange} min={0} max={100}/>
        </div>
    )
}

export default VolumeButton;