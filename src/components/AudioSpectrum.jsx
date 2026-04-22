import { AppContext } from './AppContext';
import { useContext, useEffect, useState, useRef } from 'react';
import Switch from './Switch';
import Slider from './Slider';


const AudioSpectrum = () => {
    const { audioStreamState, analyserRef } = useContext(AppContext);
    const [ audioStream, setAudioStream ] = audioStreamState;

    const [ audioData, setAudioData ] = useState(null);
    const canvasRef = useRef(null);
    const [ timeFreq, setTimeFreq] = useState(true);
    const [ dominantFreq, setDominantFreq] = useState(0);

    const xAxis = [20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
    const yAxis = [0, -20, -40, -60, -80, -100];


    const getLogPositionPercent = (freq, sampleRate = 48000) => {
        // For x axis scaling
        const nyquist = sampleRate / 2;
        const minFreq = 20;

        const logMin = Math.log10(minFreq);
        const logMax = Math.log10(nyquist);
        const logFreq = Math.log10(freq);

        return ((logFreq - logMin) / (logMax - logMin)) * 100;
    };


    const getLogPosition = (freq, width, sampleRate = 48000) => {
        // For bars position
        const nyquist = sampleRate / 2;
        const minFreq = 20;

        const logMin = Math.log10(minFreq);
        const logMax = Math.log10(nyquist);
        const logFreq = Math.log10(freq);

        return ((logFreq - logMin) / (logMax - logMin)) * width;
    };


    useEffect(() => { 
        let animationId;

        if (audioStream) {
            let bufferLength;

            const canvas = canvasRef.current;
            const canvasContext = canvas.getContext("2d");

            // Frequency
            const sampleRate = analyserRef.current.context.sampleRate;
            const nyquist = sampleRate / 2;
            const fftSize = analyserRef.current.fftSize;
            const minFreq = 20;
            const logMin = Math.log10(minFreq);
            const logMax = Math.log10(nyquist);
            const numBands = 100;
            const bandEdges = [];

            for (let i = 0; i <= numBands; i++) {
                const t = i / numBands;
                const freq = Math.pow(10, logMin + t * (logMax - logMin));
                bandEdges.push(freq);
            }

            const freqToBin = (freq) => {
                return Math.floor((freq / sampleRate) * fftSize);
            };

            const xFromFreqLog = (freq) => {
                const logFreq = Math.log10(freq);
                return ((logFreq - logMin) / (logMax - logMin)) * canvas.width;
            };

            if (timeFreq) {
                analyserRef.current.fftSize = 2048;
                bufferLength = analyserRef.current.fftSize;
            }
            else {
                analyserRef.current.fftSize = 2048;
                bufferLength = analyserRef.current.frequencyBinCount;

            }
            const dataArray = new Uint8Array(bufferLength);

            const draw = () => {
                let barWidth;
                animationId = requestAnimationFrame(draw);
                canvasContext.fillStyle = "black";
                canvasContext.fillRect(0, 0, canvas.width, canvas.height);

                // Time
                let sliceWidth;
                let x = 0;
                let v, y;

                // Frequency
                let barHeight;
                let r, g, b;


                if (timeFreq) {
                    analyserRef.current.getByteTimeDomainData(dataArray);
                    canvasContext.lineWidth = 2;
                    canvasContext.strokeStyle = "#06D6A0";
                    canvasContext.beginPath();
                    sliceWidth = canvas.width / bufferLength;
                    for (let i = 0; i < bufferLength; i++) {
                        v = dataArray[i] / 128.0;
                        y = (v * canvas.height) / 2;

                        if (i === 0) {
                            canvasContext.moveTo(x, y);
                        } else {
                            canvasContext.lineTo(x, y);
                        }

                        x += sliceWidth;
                    }
                    canvasContext.lineTo(canvas.width, canvas.height / 2);
                    canvasContext.stroke();
                }
                else {
                    analyserRef.current.getByteFrequencyData(dataArray);

                    let maxValue = 0;
                    let maxIndex = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        if (dataArray[i] > maxValue) {
                            maxValue = dataArray[i];
                            maxIndex = i;
                        }
                    }
                    setDominantFreq((maxIndex * sampleRate) / fftSize);

                    barWidth = (canvas.width / bufferLength) * 2.5;
                    for (let i = 0; i < numBands; i++) {
                        const startFreq = bandEdges[i];
                        const endFreq = bandEdges[i + 1];

                        const startBin = freqToBin(startFreq);
                        const endBin = freqToBin(endFreq);

                        // Average
                        // let sum = 0;
                        // let count = 0;
                        // for (let j = startBin; j <= endBin; j++) {
                        //     if (j >= 0 && j < bufferLength) {
                        //         sum += dataArray[j];
                        //         count++;
                        //     }
                        // }
                        // const value = count > 0 ? sum / count : 0;

                        // Max
                        const samples = 5;
                        let max = 0;
                        // for (let j = startBin; j <= endBin; j++) {
                        //     if (j >= 0 && j < bufferLength) {
                        //         max = Math.max(max, dataArray[j]);
                        //     }
                        // }
                        for (let s = 0; s < samples; s++) {
                            const t = s / (samples - 1);
                            const freq = startFreq * Math.pow(endFreq / startFreq, t);

                            const bin = Math.floor((freq / sampleRate) * fftSize);

                            if (bin >= 0 && bin < bufferLength) {
                                max = Math.max(max, dataArray[bin]);
                            }
                        }
                        const value = max;

                        // const x = (i / numBands) * canvas.width;
                        // const x = getLogPositionPercent(startFreq);
                        // const barWidth = canvas.width / numBands;

                        const x1 = getLogPosition(startFreq, canvas.width);
                        const x2 = getLogPosition(endFreq, canvas.width);

                        const barWidth = Math.max(1, x2 - x1);

                        const barHeight = value;

                        r = barHeight + 25;
                        g = 250 * (i / bufferLength);
                        b = 50;
                        canvasContext.fillStyle = `rgb(${r}, ${g}, ${b})`;  // #fc2658

                        canvasContext.fillRect(
                        x1,
                        canvas.height - barHeight,
                        barWidth,
                        barHeight
                        );
                    }
                }                
            }
            draw();
            return () => cancelAnimationFrame(animationId);
        };
        
    }, [audioStream, timeFreq])


    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        };

        resizeCanvas();

        const observer = new ResizeObserver(() => {
            resizeCanvas();
        });

        observer.observe(canvas);

        return () => observer.disconnect();
    }, []);


    return (
        <div className='flex flex-col gap-10 w-full'>
            <div className="relative w-full flex-1 min-h-0 rounded-lg flex flex-col gap-5">
                <div className='absolute top-2 right-2 z-10'>
                    <Switch setTimeFreq={setTimeFreq}></Switch>
                </div>
                
                <div className="w-full flex flex-col">
                    <div className="relative w-full flex-1 border border-border rounded-lg">
                        <canvas ref={canvasRef} className="w-full h-full rounded-lg" />
                        <div className={`absolute top-2 left-2 text-white text-sm bg-black/50 px-2 py-1 rounded ${timeFreq? "invisible" : ""}`}>
                            {Math.round(dominantFreq)} Hz
                        </div>
                    </div>

                    <div id="x-axis" className={`relative w-full h-6 mt-1 ${timeFreq? "invisible" : ""}`}>
                        {xAxis.map((freq) => {
                            const left = getLogPositionPercent(freq);
                            return (
                                <div key={freq} className="absolute flex flex-col items-center text-gray-300" 
                                style={{left: `${left}%`, transform: "translateX(-50%)"}}>
                                    <div className="w-px h-2 bg-gray-400"></div>
                                    <div className="text-xs">
                                        {freq >= 1000 ? `${freq / 1000}k` : freq}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Slider></Slider>
            </div>
        </div>
    )
}

export default AudioSpectrum;