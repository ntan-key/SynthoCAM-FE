import './Slider.css'
import { AppContext } from './AppContext';
import { useEffect, useState, useContext } from 'react';

// const Slider = () => {
//     const { lowerCutoffState, upperCutoffState, filterLowRef, filterHighRef } = useContext(AppContext);
//     const [lowerCutoff, setLowerCutoff] = lowerCutoffState;
//     const [upperCutoff, setUpperCutoff] = upperCutoffState;


//     const lowerChange = (e) => {
//         console.log(`lower cutoff: ${e.target.value}`);
//         setLowerCutoff(e.target.value);

//         e.target.value = Math.min(e.target.value, e.target.parentNode.childNodes[2].value - 1);
//         var value = (100 / ( parseInt(e.target.max) - parseInt(e.target.min) )) * parseInt(e.target.value) - (100 / (parseInt(e.target.max) - parseInt(e.target.min) )) * parseInt(e.target.min);

//         var children = e.target.parentNode.childNodes[0].childNodes;
//         children[0].style.width = `${value}%`;
//         children[2].style.left = `${value}%`;
//         children[3].style.left = `${value}%`;
//         children[5].style.left = `${value}%`;

//         children[5].childNodes[0].innerHTML = e.target.value;
//     }


//     const upperChange = (e) => {
//         console.log(`upper cutoff: ${e.target.value}`);
//         setUpperCutoff(e.target.value);

//         e.target.value = Math.max(e.target.value, e.target.parentNode.childNodes[1].value - (-1));
//         var value = (100 / ( parseInt(e.target.max) - parseInt(e.target.min) )) * parseInt(e.target.value) - (100 / ( parseInt(e.target.max) - parseInt(e.target.min) )) * parseInt(e.target.min);

//         var children = e.target.parentNode.childNodes[0].childNodes;
//         children[1].style.width = `${100-value}%`;
//         children[2].style.right = `${100-value}%`;
//         children[4].style.left = `${value}%`;
//         children[6].style.left = `${value}%`;

//         children[6].childNodes[0].innerHTML = e.target.value;
//     }


//     useEffect(() => {
//         const handleLeft = document.querySelector('#RangeSlider .range-slider-handle-left');
//         const handleRight = document.querySelector('#RangeSlider .range-slider-handle-right');

//         const tooltipLeft = document.querySelector('#RangeSlider .range-slider-tooltip-left');
//         const tooltipRight = document.querySelector('#RangeSlider .range-slider-tooltip-right');

//         const tooltipLeftText = document.querySelector('#RangeSlider .range-slider-tooltip-left .range-slider-tooltip-text');
//         const tooltipRightText = document.querySelector('#RangeSlider .range-slider-tooltip-right .range-slider-tooltip-text');

//         document.querySelector('#RangeSlider .range-slider-val-left').style.width = `${lowerCutoff + (100 - upperCutoff)}%`;
//         document.querySelector('#RangeSlider .range-slider-val-right').style.width = `${lowerCutoff + (100 - upperCutoff)}%`;
        
//         document.querySelector('#RangeSlider .range-slider-val-range').style.left = `${lowerCutoff}%`;
//         document.querySelector('#RangeSlider .range-slider-val-range').style.right = `${(100 - upperCutoff)}%`;

//         handleLeft.style.left = `${lowerCutoff}%`;
//         handleRight.style.left = `${upperCutoff}%`;

//         tooltipLeft.style.left = `${lowerCutoff}%`;
//         tooltipRight.style.left = `${upperCutoff}%`;

//         tooltipLeftText.textContent = lowerCutoff;
//         tooltipRightText.textContent = upperCutoff;
//     }, [])


//     useEffect(() => {
//         if (filterLowRef.current) {
//             filterLowRef.current.frequency.value = lowerCutoff * 100;
//         }
//     }, [lowerCutoff])


//     useEffect(() => {
//         if (filterHighRef.current) {
//             filterHighRef.current.frequency.value = upperCutoff * 100;
//         }
//     }, [upperCutoff])
    

//     return (
//         <div className=''>
//             <div id="RangeSlider" className="range-slider">
//                 <div>
//                     <div className="range-slider-val-left"></div>
//                     <div className="range-slider-val-right"></div>
//                     <div className="range-slider-val-range"></div>
                    
//                     <span className="range-slider-handle range-slider-handle-left"></span>
//                     <span className="range-slider-handle range-slider-handle-right"></span>
                    
//                     <div className="range-slider-tooltip range-slider-tooltip-left">
//                         <span className="range-slider-tooltip-text"></span>
//                     </div>
                    
//                     <div className="range-slider-tooltip range-slider-tooltip-right">
//                         <span className="range-slider-tooltip-text"></span>
//                     </div>
//                 </div>
                
//                 <input type="range" className="range-slider-input-left" tabIndex={0} min={0} max={100} step={1} value={lowerCutoff} onChange={lowerChange}/>
//                 <input type="range" className="range-slider-input-right" tabIndex={0} min={0} max={100} step={1} value={upperCutoff} onChange={upperChange}/>
//             </div>
//         </div>
        
//     )
// }

const MIN = 20;
const MAX = 20000;


const toPercent = (value) =>
    ((value - MIN) / (MAX - MIN)) * 100;


const clamp = (n, min, max) => {
    let num = Number(n)
    if (!Number.isFinite(num)) return 20;
    return Math.min(Math.max(num, min), max);
};


const Slider = () => {
  const { lowerCutoffState, upperCutoffState, filterLowRef, filterHighRef, audioContextRef } = useContext(AppContext);
  const [lowerCutoff, setLowerCutoff] = lowerCutoffState;
  const [upperCutoff, setUpperCutoff] = upperCutoffState;


  const lowerChange = (e) => {
    console.log(`lower cutoff: ${e.target.value}`);
    let value = clamp(e.target.value, MIN, upperCutoff - 1);
    setLowerCutoff(value);

    // e.target.value = Math.min(e.target.value, e.target.parentNode.childNodes[2].value - 1);
    // var value = (100 / ( parseInt(e.target.max) - parseInt(e.target.min) )) * parseInt(e.target.value) - (100 / (parseInt(e.target.max) - parseInt(e.target.min) )) * parseInt(e.target.min);

    // var children = e.target.parentNode.childNodes[0].childNodes;
    // children[0].style.width = `${value}%`;
    // children[2].style.left = `${value}%`;
    // children[3].style.left = `${value}%`;
    // children[5].style.left = `${value}%`;

    // children[5].childNodes[0].innerHTML = e.target.value;
  };


  const upperChange = (e) => {
    console.log(`upper cutoff: ${e.target.value}`);
    let value = clamp(e.target.value, lowerCutoff + 1, MAX);
    setUpperCutoff(value);
    // e.target.value = Math.max(e.target.value, e.target.parentNode.childNodes[1].value - (-1));
    // var value = (100 / ( parseInt(e.target.max) - parseInt(e.target.min) )) * parseInt(e.target.value) - (100 / ( parseInt(e.target.max) - parseInt(e.target.min) )) * parseInt(e.target.min);

    // var children = e.target.parentNode.childNodes[0].childNodes;
    // children[1].style.width = `${100-value}%`;
    // children[2].style.right = `${100-value}%`;
    // children[4].style.left = `${value}%`;
    // children[6].style.left = `${value}%`;

    // children[6].childNodes[0].innerHTML = e.target.value;
  };


  useEffect(() => {
    if (filterLowRef.current) {
    //   filterLowRef.current.frequency.value = lowerCutoff;
    const now = audioContextRef.current.currentTime;

    filterLowRef.current.frequency.cancelScheduledValues(now);
    filterLowRef.current.frequency.linearRampToValueAtTime(lowerCutoff, now + 0.05);
    }
  }, [lowerCutoff]);


  useEffect(() => {
    if (filterHighRef.current) {
    //   filterHighRef.current.frequency.value = upperCutoff;
    const now = audioContextRef.current.currentTime;

    filterHighRef.current.frequency.cancelScheduledValues(now);
    filterHighRef.current.frequency.linearRampToValueAtTime(upperCutoff, now + 0.05);
    }
  }, [upperCutoff]);


  useEffect(() => {
    if (!filterLowRef.current || !filterHighRef.current || !audioContextRef.current) return;

    const now = audioContextRef.current.currentTime;

    const low = Math.min(lowerCutoff, upperCutoff - 1);
    const high = Math.max(upperCutoff, low + 1);

    filterLowRef.current.frequency.cancelScheduledValues(now);
    filterHighRef.current.frequency.cancelScheduledValues(now);

    filterLowRef.current.frequency.linearRampToValueAtTime(low, now + 0.05);
    filterHighRef.current.frequency.linearRampToValueAtTime(high, now + 0.05);

    }, [lowerCutoff, upperCutoff]);


  useEffect(() => {
    const left = toPercent(lowerCutoff);
    const right = toPercent(upperCutoff);

    const valLeft = document.querySelector('#RangeSlider .range-slider-val-left');
    const valRight = document.querySelector('#RangeSlider .range-slider-val-right');
    const valRange = document.querySelector('#RangeSlider .range-slider-val-range');

    const handleLeft = document.querySelector('#RangeSlider .range-slider-handle-left');
    const handleRight = document.querySelector('#RangeSlider .range-slider-handle-right');

    const tooltipLeft = document.querySelector('#RangeSlider .range-slider-tooltip-left');
    const tooltipRight = document.querySelector('#RangeSlider .range-slider-tooltip-right');

    const tooltipLeftText = document.querySelector('#RangeSlider .range-slider-tooltip-left .range-slider-tooltip-text');
    const tooltipRightText = document.querySelector('#RangeSlider .range-slider-tooltip-right .range-slider-tooltip-text');

    // Range fill
    valLeft.style.width = `${left}%`;
    valRight.style.width = `${100 - right}%`;
    valRange.style.left = `${left}%`;
    valRange.style.right = `${100 - right}%`;

    // Handles
    handleLeft.style.left = `${left}%`;
    handleRight.style.left = `${right}%`;

    // Tooltips
    tooltipLeft.style.left = `${left}%`;
    tooltipRight.style.left = `${right}%`;

    tooltipLeftText.textContent = Math.round(lowerCutoff);
    tooltipRightText.textContent = Math.round(upperCutoff);
  }, [lowerCutoff, upperCutoff]);


  return (
    
    <div>
      <div id="RangeSlider" className="range-slider">
        <div>
          <div className="range-slider-val-left"></div>
          <div className="range-slider-val-right"></div>
          <div className="range-slider-val-range"></div>

          <span className="range-slider-handle range-slider-handle-left"></span>
          <span className="range-slider-handle range-slider-handle-right"></span>

          <div className="range-slider-tooltip range-slider-tooltip-left">
            <span className="range-slider-tooltip-text"></span>
          </div>

          <div className="range-slider-tooltip range-slider-tooltip-right">
            <span className="range-slider-tooltip-text"></span>
          </div>
        </div>

        <input type="range" className="range-slider-input-left" min={MIN} max={MAX} step={1} value={lowerCutoff} onChange={lowerChange}/>
        <input type="range" className="range-slider-input-right" min={MIN} max={MAX} step={1} value={upperCutoff} onChange={upperChange}/>
      </div>
    </div>
  );
};

export default Slider;
