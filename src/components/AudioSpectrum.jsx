import { AppContext } from './AppContext';
import { useContext, useEffect, useState, useRef } from 'react';


const AudioSpectrum = () => {
    const { audioStreamState } = useContext(AppContext);
    const [ audioStream, setAudioStream ] = audioStreamState;
    const [ audioData, setAudioData ] = useState(null);
    const canvasRef = useRef(null);

    const audioContext = null;
    const source = null;
    const analyser = null;


    useEffect(() => {
        if (audioStream) {
            console.log(audioStream)
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(audioStream);
            const analyser = audioContext.createAnalyser();

            // Time
            analyser.fftSize = 2048;

            // // Frequency
            // analyser.fftSize = 256;

            source.connect(analyser);
            
            // Time
            const bufferLength = analyser.fftSize;

            // // Freqeuency
            // const bufferLength = analyser.frequencyBinCount;

            const dataArray = new Uint8Array(bufferLength);
            const canvas = canvasRef.current;
            const canvasContext = canvas.getContext("2d");


            const draw = () => {
                requestAnimationFrame(draw);

                // Time
                analyser.getByteTimeDomainData(dataArray);

                // // Frequency
                // analyser.getByteFrequencyData(dataArray);

                setAudioData(dataArray);
                canvasContext.fillStyle = "black";
                canvasContext.fillRect(0, 0, canvas.width, canvas.height);

                // Time (Waveform)
                canvasContext.lineWidth = 2;
                canvasContext.strokeStyle = "lime";
                canvasContext.beginPath();
                const sliceWidth = canvas.width / bufferLength;

                // // Frequency (Bar Plot)
                // const barWidth = (canvas.width / bufferLength) * 2.5;

                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    
                    // Time

                    const v = dataArray[i] / 128.0;
                    const y = (v * canvas.height) / 2;

                    if (i === 0) {
                    canvasContext.moveTo(x, y);
                    } else {
                    canvasContext.lineTo(x, y);
                    }

                    x += sliceWidth;

                    // // Frequency

                    // const barHeight = dataArray[i];

                    // const r = barHeight + 25;
                    // const g = 250 * (i / bufferLength);
                    // const b = 50;

                    // canvasContext.fillStyle = `rgb(${r}, ${g}, ${b})`;
                    // canvasContext.fillRect(
                    // x,
                    // canvas.height - barHeight,
                    // barWidth,
                    // barHeight
                    // );

                    // x += barWidth + 1;
                }

                // Time
                canvasContext.lineTo(canvas.width, canvas.height / 2);
                canvasContext.stroke();

            }

            draw();

        };

        return () => {
            if (audioContext) {
                audioContext.close();
            }
            if (source) {
                source.disconnect();
            }
            if (analyser) {
                analyser.disconnect();
            }
        };
        
    }, [audioStream])

    return (
        <div className="h-full w-full border border-border rounded-lg">
            <canvas ref={canvasRef} className='h-full w-full bg-white rounded-lg'></canvas>
        </div>
    )
}

export default AudioSpectrum