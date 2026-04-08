import Logo from '../assets/logo.svg';
import Live from '../assets/live.png';

import { useContext, useEffect } from 'react';
import { AppContext } from "./AppContext";


const Navbar = () => {
    // JS goes here
    const { wsStatusState, pcStatusState } = useContext(AppContext);
    const [pcStatus, setPcStatus] = wsStatusState;
    const [wsStatus, setWsStatus] = wsStatusState;
    
    const wsReadyState = {0: "connecting", 1: "connected", 2: "disconnecting", 3: "disconnected"};


    const liveButtonPress = () => {
        console.log('Live button press')
    };


    useEffect (() => {},[wsStatus]);


    return (
        <div className="h-20 flex shrink-0 justify-between items-center bg-navbar border-b border-border p-5">
            <div className='flex items-center justify-start gap-3'>
                <img src={Logo} alt="logo" className='h-10' />
                <h1 className='text-white font-bold text-xl font-[Tahoma]'>SynthoCAM Remote Stream</h1>
            </div>
            <div className='flex gap-5 items-center'>
                <div className='flex gap-2 items-center'>
                    <div className='text-white text-xs md:text-base'>{wsReadyState[wsStatus]}</div>
                    <div className={`h-3 w-3 rounded-full ${wsStatus == 1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
                <button className='flex gap-2 py-1 px-2 md:px-5 items-center rounded-sm text-white font-bold bg-linear-to-r from-red-500 to-red-700' onClick={liveButtonPress}>
                    <img src={Live} alt="Play Icon" className='h-5 w-5 flex-shrink-0' />
                    <div>Live</div>
                </button>
            </div>
        </div>
    )
}

export default Navbar;