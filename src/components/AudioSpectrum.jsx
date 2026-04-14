import { AppContext } from './AppContext';
import { useContext, useEffect, useState, useRef } from 'react';
import Switch from './Switch';
import Slider from './Slider';


const AudioSpectrum = () => {
    const { audioStreamState, analyserRef } = useContext(AppContext);
    const [ audioStream, setAudioStream ] = audioStreamState;

    const [ audioData, setAudioData ] = useState(null);
    const canvasRef = useRef(null);
    const [timeFreq, setTimeFreq] = useState(true)


    useEffect(() => {
        if (audioStream) {

            if (timeFreq) {
                // Time
                analyserRef.current.fftSize = 2048;
            }
            else {
                // Frequency
                analyserRef.current.fftSize = 256;
            }

            let bufferLength;
            if (timeFreq) {
                // Time
                bufferLength = analyserRef.current.fftSize;
            }
            else {
                // Frequency
                bufferLength = analyserRef.current.frequencyBinCount;
            }

            const dataArray = new Uint8Array(bufferLength);
            const canvas = canvasRef.current;
            const canvasContext = canvas.getContext("2d");


            const draw = () => {
                requestAnimationFrame(draw);

                if (timeFreq) {
                    // Time
                    analyserRef.current.getByteTimeDomainData(dataArray);
                }
                else {
                    // Frequency
                    analyserRef.current.getByteFrequencyData(dataArray);
                }

                setAudioData(dataArray);
                canvasContext.fillStyle = "black";
                canvasContext.fillRect(0, 0, canvas.width, canvas.height);

                let sliceWidth;
                let barWidth;
                if (timeFreq) {
                    // Time
                    canvasContext.lineWidth = 2;
                    canvasContext.strokeStyle = "#06D6A0";
                    canvasContext.beginPath();
                    sliceWidth = canvas.width / bufferLength;
                }
                else {
                    // Frequency
                    barWidth = (canvas.width / bufferLength) * 2.5;
                }

                let x = 0;
                for (let i = 0; i < bufferLength; i++) {
                    
                    let v;
                    let y;
                    let barHeight;
                    let r;
                    let g;
                    let b;

                    if (timeFreq) {
                        // Time
                        v = dataArray[i] / 128.0;
                        y = (v * canvas.height) / 2;

                        if (i === 0) {
                        canvasContext.moveTo(x, y);
                        } else {
                        canvasContext.lineTo(x, y);
                        }

                        x += sliceWidth;
                    }
                    else {
                        // Frequency

                        barHeight = dataArray[i];

                        r = barHeight + 25;
                        g = 250 * (i / bufferLength);
                        b = 50;

                        canvasContext.fillStyle = `rgb(${r}, ${g}, ${b})`;  // #fc2658
                        canvasContext.fillRect(
                        x,
                        canvas.height - barHeight,
                        barWidth,
                        barHeight
                        );

                        x += barWidth + 1;
                    }                    

                    
                }

                if (timeFreq) {
                    // Time
                    canvasContext.lineTo(canvas.width, canvas.height / 2);
                    canvasContext.stroke();
                } 
                
            }

            draw();

        };
        
    }, [audioStream, timeFreq])


    return (
        <div className='flex flex-col gap-10 w-full'>
            <div className="relative h-full w-full border border-border rounded-lg flex flex-col gap-5">
                <div className='absolute top-2 right-2 z-10'>
                    <Switch setTimeFreq={setTimeFreq}></Switch>
                </div>
                <canvas ref={canvasRef} className='h-full w-full bg-white rounded-lg'></canvas>
            <Slider></Slider>
            </div>
        </div>
        
    )
}

export default AudioSpectrum;