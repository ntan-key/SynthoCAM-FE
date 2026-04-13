import './Switch.css';
import { useState } from 'react';


const Switch = ({setTimeFreq}) => {
    const [on, setOn] = useState(true)

    const toggle = () => {
        let switchElement = document.getElementById('label');
        // onChange();
        setOn(!on)
        setTimeFreq(!on)
        console.log(`switch: ${on? 'Frequency': 'Time'}`)
    }
    return (
        <div className='flex text-white gap-1'>
            <div>Freq</div>
            <input type="checkbox" id={"switch"} className="switch-checkbox" onChange={toggle} checked={on} />
            <label htmlFor={"switch"} className="switch-label" id='label' style={{background: on && '#06D6A0'}}>
                <span className="switch-button"></span>
            </label>
            <div>Time</div>
        </div>
    )
}

export default Switch;