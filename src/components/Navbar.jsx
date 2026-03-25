import Logo from '../assets/logo.svg';
import Live from '../assets/live.png';
import { useWebSocket } from "./WebSocketContext";


const Navbar = () => {
    // JS goes here
    const { connectRPI } = useWebSocket()

    const liveButtonPress = () => {
        console.log('Live button press')
        connectRPI()
    }

    return (
        <div className="h-20 flex shrink-0 justify-between items-center bg-navbar border-b border-border p-5">
            {/* HTML goes here */}
            <div className='flex items-center justify-start gap-3'>
                <img src={Logo} alt="logo" className='h-10' />
                <h1 className='text-white font-bold text-xl font-[Tahoma]'>SynthoCAM Remote Stream</h1>
            </div>
            <button className='h-min w-auto text-white font-bold rounded-sm px-5 py-1 flex gap-2 bg-linear-to-r from-red-500 to-red-700' onClick={liveButtonPress}>
                <img src={Live} alt="Play Icon" className='h-5' />
                <p>Live</p>
            </button>
        </div>
    )
}

export default Navbar