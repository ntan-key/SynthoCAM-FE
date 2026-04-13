import { AppContext } from './AppContext';
import { useContext, useEffect, useState, useRef } from 'react';
import Switch from './Switch';
import Slider from './Slider';


const AudioSpectrum = () => {
    const { audioStreamState, analyserRef, muteState, volumeState, lowerCutoffState, upperCutoffState } = useContext(AppContext);
    const [ audioStream, setAudioStream ] = audioStreamState;
    // const [mute, setMute] = muteState;
    // const [volume, setVolume] = volumeState;
    // const [lowerCutoff, setLowerCutoff] = lowerCutoffState;
    // const [upperCutoff, setUpperCutoff] = upperCutoffState;
    // const gainRef = useRef(null);

    const [ audioData, setAudioData ] = useState(null);
    const canvasRef = useRef(null);
    const [timeFreq, setTimeFreq] = useState(true)

    const audioContext = null;
    const source = null;
    // const analyser = null;


    useEffect(() => {
        if (audioStream) {
            // const audioContext = new AudioContext();
            // const source = audioContext.createMediaStreamSource(audioStream);
            // const analyser = audioContext.createAnalyser();
            // const gainNode = audioContext.createGain();
            // gainRef.current = gainNode;

            if (timeFreq) {
                // Time
                analyserRef.current.fftSize = 2048;
            }
            else {
                // Frequency
                analyserRef.current.fftSize = 256;
            }

            // const filterLow = audioContext.createBiquadFilter();
            // filterLow.type = "highpass";
            // filterLow.frequency.value = lowerCutoff;  // cutoff frequency

            // const filterHigh = audioContext.createBiquadFilter();
            // filterHigh.type = "lowpass";
            // filterHigh.frequency.value = upperCutoff;  // cutoff frequency

            // source.connect(gainNode);
            // gainNode.connect(filterLow);
            // filterLow.connect(filterHigh);
            // filterHigh.connect(analyser);
            // analyser.connect(audioContext.destination)  // connects audio context to speakers

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

        // return () => {
        //     if (audioContext) {
        //         audioContext.close();
        //     }
        //     if (source) {
        //         source.disconnect();
        //     }
        //     if (analyserRef.current) {
        //         analyser.disconnect();
        //     }
        // };
        
    }, [audioStream, timeFreq])


    // useEffect(() => {
    //     if (gainRef.current) {
    //         if (mute) {
    //             gainRef.current.gain.value = 0.0;
    //         }
    //         else {
    //             gainRef.current.gain.value = volume / 100;
    //         }
    //     }
    // }, [mute, volume])

    return (
        <div className='flex flex-col gap-5'>
            <div className="h-full w-full border border-border rounded-lg flex flex-col gap-5">
                <canvas ref={canvasRef} className='h-full w-full bg-white rounded-lg'></canvas>
            </div>
            <Switch setTimeFreq={setTimeFreq}></Switch>
            <Slider></Slider>
        </div>
        
    )
}

export default AudioSpectrum