import 'primeicons/primeicons.css';
import Logo from '../assets/logo.svg';
import { Button } from 'primereact/button';
import Live from '../assets/live.png'

const Navbar = () => {
    // JS goes here

    const liveButtonPress = () => {
        console.log('Live button press')
    }

    return (
        <div className="h-20 flex shrink-0 justify-between items-center bg-navbar border-b border-border p-5">
            {/* HTML goes here */}
            <div className='flex items-center justify-start gap-3'>
                <img src={Logo} alt="logo" className='h-10' />
                <h1 className='text-white font-bold text-xl font-[Tahoma]'>SynthoCAM Remote Stream</h1>
            </div>
            <Button className='h-min w-auto text-white font-bold rounded-sm px-5 py-1 flex gap-2 bg-linear-to-r from-red-500 to-red-700' onClick={liveButtonPress}>
                <img src={Live} alt="Play Icon" className='h-5' />
                <p>Live</p>
            </Button>
        </div>
    )
}

export default Navbar