import { createContext, useState, useRef, useEffect } from "react";

export const AppContext = createContext(null);

export const AppContextProvider = ({ ip, port, children }) => {
    const wsRef = useRef(null);
    const [wsStatus, setWsStatus] = useState(3);

    const pcRef = useRef(null);
    const [pcStatus, setPcStatus] = useState('disconnected');

    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const [audioStream, setAudioStream] = useState(null);

    const [remoteStats, setRemoteStats] = useState(null);

    const [mute, setMute] = useState(false);
    const [volume, setVolume] = useState(100);
    const [record, setRecord] = useState(false);

    const [lowerCutoff, setLowerCutoff] = useState(20);
    const [upperCutoff, setUpperCutoff] = useState(20000);
    const analyserRef = useRef(null);
    const gainRef = useRef(null);
    const filterLowRef = useRef(null);
    const filterHighRef = useRef(null);
    const filterHigh2Ref = useRef(null);
    const sourceRef = useRef(null);
    const audioContextRef = useRef(null);

    const [filename, setFilename] = useState('');
    const [fileList, setFileList] = useState([]);

    const iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ];

    const cleanupAudioGraph = () => {
        try { sourceRef.current?.disconnect(); } catch {}
        try { gainRef.current?.disconnect(); } catch {}
        try { filterLowRef.current?.disconnect(); } catch {}
        try { filterHighRef.current?.disconnect(); } catch {}
        try { analyserRef.current?.disconnect(); } catch {}

        sourceRef.current = null;
        gainRef.current = null;
        filterLowRef.current = null;
        filterHighRef.current = null;
        analyserRef.current = null;
    };

    const ensureAudioContext = async () => {
        let audioContext = audioContextRef.current;

        if (!audioContext || audioContext.state === "closed") {
            audioContext = new AudioContext();
            audioContextRef.current = audioContext;
            audioContext.onstatechange = () => {
                console.log("AudioContext state:", audioContext.state);
            };
        }

        if (audioContext.state === "suspended") {
            await audioContext.resume();
        }

        return audioContext;
    };

    const connectWs = () => {
        console.log('attempting to connect to websocket...')
        let heartbeatInterval = null;
        try {
            console.log(window.location.host)
            const ws = new WebSocket(`wss://${window.location.host}/ws`);
            wsRef.current = ws;
            setWsStatus(ws.readyState)

            ws.onopen = () => {
                console.log('ws.onopen')
                setWsStatus(ws.readyState)

                setTimeout(() => connectPc(), 0)

                heartbeatInterval = setInterval(() => {
                    if (ws.readyState == WebSocket.OPEN) {
                        ws.send(JSON.stringify({
                            type: "heartbeat"
                        }))
                    }
                }, 5000)
            }

            ws.onmessage = async (event) => {
                setWsStatus(ws.readyState)
                const data = JSON.parse(event.data)

                try {
                    if (data.type !== "heartbeat-response") {
                        if (data.type == "answer") {
                            console.log('ws answer')
                            if (pcRef.current.signalingState == 'have-local-offer') {
                                console.log(pcRef.current.signalingState)
                                await pcRef.current.setRemoteDescription(new RTCSessionDescription({
                                    type: data.type,
                                    sdp: data.sdp
                                }));
                            }
                        }

                        else if (data.type == "ice-candidate") {
                            console.log('ws ice-candidate')
                            await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                        }

                        else if (data.type == "error") {
                            console.log(`ws server error: ${data.message}`)
                        }

                        else if (data.type == "remote-stats") {
                            setRemoteStats(data)
                        }

                        else if (data.type == "recording-saved") {
                            console.log('recording-saved')
                            console.log(data)
                            setFileList(prev => [...prev, { "title": data["filename"], "thumbnail": data["thumbnail"] }])
                            console.log(fileList)
                        }
                    }
                }
                catch (error) {
                    console.error(`error handling ws message: ${error}`)
                    console.log(data)
                }
            }

            ws.onerror = () => {
                console.log('ws.onerror')
                setWsStatus(ws.readyState)
            }

            ws.onclose = () => {
                console.log('ws.onclose')
                setWsStatus(ws.CLOSED)
                if (heartbeatInterval) {
                    clearInterval(heartbeatInterval);
                    heartbeatInterval = null;
                }
                teardown();

                setTimeout(() => {
                    connectWs();
                }, 5000);
            }
        }
        catch (error) {
            console.log(`error opening websocket: ${error}`)
        }
    }

    const connectPc = async () => {
        console.log('attempting to connect stream via peer connection...')
        const pc = new RTCPeerConnection({ "iceServers": iceServers, "iceTransportPolicy": "all" });
        pcRef.current = pc;

        const statsInterval = setInterval(async () => {
            try {
                const stats = await pc.getStats();

                stats.forEach((report) => {
                    if (report.type === "inbound-rtp" && report.kind === "video") {
                        console.log("WEBRTC VIDEO", {
                            jitter: report.jitter,
                            packetsLost: report.packetsLost,
                            framesPerSecond: report.framesPerSecond,
                            bytesReceived: report.bytesReceived,
                            framesDecoded: report.framesDecoded,
                            framesDropped: report.framesDropped,
                            jitterBufferDelay: report.jitterBufferDelay,
                            jitterBufferEmittedCount: report.jitterBufferEmittedCount,
                            totalDecodeTime: report.totalDecodeTime,
                            decoderImplementation: report.decoderImplementation,
                        });
                    }

                    if (report.type === "track" && report.kind === "video") {
                        console.log("WEBRTC TRACK", {
                            framesReceived: report.framesReceived,
                            framesDecoded: report.framesDecoded,
                            framesDropped: report.framesDropped,
                            jitterBufferDelay: report.jitterBufferDelay,
                            jitterBufferEmittedCount: report.jitterBufferEmittedCount,
                        });
                    }

                    if (report.type === "candidate-pair" && report.state === "succeeded") {
                        console.log("WEBRTC NET", {
                            rtt: report.currentRoundTripTime,
                            availableIncomingBitrate: report.availableIncomingBitrate,
                        });
                    }
                });
            } catch (error) {
                console.log("getStats error", error);
            }
        }, 1000);

        pc.addTransceiver("video", { direction: "recvonly" });
        pc.addTransceiver("audio", { direction: "recvonly" });

        pc.ontrack = async (event) => {
            console.log('pc.ontrack');
            const track = event.track;

            if (track.kind == 'video') {
                console.log('pc.video track added');
                videoRef.current.srcObject = event.streams[0];
                videoRef.current.muted = true;
            } else if (track.kind == 'audio') {
                console.log('pc.audio track added');

                cleanupAudioGraph();
                const audioContext = await ensureAudioContext();

                const source = audioContext.createMediaStreamSource(event.streams[0]);
                sourceRef.current = source;

                const analyser = audioContext.createAnalyser();
                analyserRef.current = analyser;

                const gainNode = audioContext.createGain();
                //gainNode.gain.value = volume / 100;  /// origional
                gainNode.gain.value = volume / 100 * 3.0;     // added gain - a slider may be good nextsay 0% to 200%
                gainRef.current = gainNode;

                const filterLow = audioContext.createBiquadFilter();
                filterLow.type = "highpass";
                filterLow.frequency.value = lowerCutoff;
                filterLowRef.current = filterLow;

                const filterHigh = audioContext.createBiquadFilter();
                filterHigh.type = "lowpass";
                filterHigh.frequency.value = upperCutoff;
                filterHighRef.current = filterHigh;

                const filterHigh2 = audioContext.createBiquadFilter();
                filterHigh2.type = "lowpass";
                filterHigh2.frequency.value = upperCutoff;
                filterHigh2Ref.current = filterHigh2;

                // try to remove video /constant frequeny noise(s)
                const notch = audioContext.createBiquadFilter();
                notch.type = "notch";
                notch.frequency.value = 8000;
                notch.Q.value = 2;

                // try to remove video /constant frequeny noise(s) - PAL video horizontal scan freq
                const notch2 = audioContext.createBiquadFilter();
                notch2.type = "notch";
                notch2.frequency.value = 15625;
                notch2.Q.value = 3;
                
                // Expander (soft noise gate) to reduce realatively backgound to signal noise... (WIP)
                const compressor = audioContext.createDynamicsCompressor();
                compressor.threshold.value = -50;
                compressor.knee.value = 20;
                compressor.ratio.value = 4;
                compressor.attack.value = 0.003;
                compressor.release.value = 0.25;

                source.connect(filterLow);
                filterLow.connect(filterHigh);
                filterHigh.connect(filterHigh2); // added for sharper cuttoff 
                //filterHigh2.connect(analyser);
                filterHigh2.connect(notch);      // added to remove ~8Khz
                notch.connect(notch2);      // added to remove ~8Khz
                notch2.connect(gainNode);
                //compressor.connect(gainNode);
                gainNode.connect(analyser);
                analyser.connect(audioContext.destination);

                setAudioStream(event.streams[0]);
            }
        }

        pc.onicecandidate = (event) => {
            console.log('pc.onicecandidate');
            if (event.candidate && wsRef.current) {
                if (wsRef.current.readyState == WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({
                        type: 'ice-candidate',
                        candidate: event.candidate
                    }));
                }
            }
        };

        pc.onconnectionstatechange = () => {
            console.log('pc.onconnectionstatechange')
            console.log(`pc.state: ${pc.connectionState}`)
            setPcStatus(pc.connectionState);

            if (pc.connectionState == "checking") {
                console.log('pc.checking - testing candidates')
            } else if (pc.connectionState == "connected") {
                console.log('pc.connected - working pair found')
            } else if (pc.connectionState == "completed") {
                console.log('pc.completed - fully established')
            } else if (pc.connectionState == "failed") {
                console.log('pc.connection failed')
            }

            if (
                pc.connectionState == "closed" ||
                pc.connectionState == "failed" ||
                pc.connectionState == "disconnected"
            ) {
                clearInterval(statsInterval);
            }
        }

        try {
            console.log('sending offer')
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);

            wsRef.current.send(JSON.stringify({
                type: 'offer',
                sdp: offer.sdp
            }));
        } catch (error) {
            console.log(`error sending offer: ${error}`)
        }
    }

    const teardown = () => {
        console.log('ws pc teardown');

        cleanupAudioGraph();

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        if (audioRef.current) {
            audioRef.current.srcObject = null;
        }
    };

    useEffect(() => {
        connectWs();
        return () => {
            teardown()
        }
    }, [ip, port]);

    return (
        <AppContext.Provider value={{
            ip,
            port,
            wsRef,
            wsStatusState: [wsStatus, setWsStatus],
            pcStatusState: [pcStatus, setPcStatus],
            videoRef,
            audioRef,
            audioStreamState: [audioStream, setAudioStream],
            remoteStatsState: [remoteStats, setRemoteStats],
            analyserRef,
            gainRef,
            filterLowRef,
            filterHighRef,
            muteState: [mute, setMute],
            volumeState: [volume, setVolume],
            recordState: [record, setRecord],
            lowerCutoffState: [lowerCutoff, setLowerCutoff],
            upperCutoffState: [upperCutoff, setUpperCutoff],
            filenameState: [filename, setFilename],
            fileListState: [fileList, setFileList],
            audioContextRef,
        }}>
            {children}
        </AppContext.Provider>
    )
};
