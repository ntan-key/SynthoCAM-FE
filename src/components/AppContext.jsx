import { createContext, useState, useRef, useEffect } from "react";


export const AppContext = createContext(null);

export const AppContextProvider = ({ip, port, children}) => {
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
    const audioContextRef = useRef(new AudioContext());

    const [filename, setFilename] = useState('');
    const [fileList, setFileList] = useState([]);

    const iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ];

    
    const connectWs = () => {
        console.log('attempting to connect to websocket...')
        let heartbeatInterval = null;
        try{
            console.log(window.location.host)
            // const ws = new WebSocket(`wss://${ip}:${port}/ws`);
            const ws = new WebSocket(`wss://${window.location.host}/ws`);
            wsRef.current = ws;
            setWsStatus(ws.readyState)

            ws.onopen = () => {
                console.log('ws.onopen')
                setWsStatus(ws.readyState)

                setTimeout(() => connectPc(), 0)

                // heartbeat every 5 seconds
                heartbeatInterval = setInterval(() => {
                    if (ws.readyState == WebSocket.OPEN){
                        ws.send(JSON.stringify({
                            type: "heartbeat"
                        }))
                    }
                }, 5000)
            }

            ws.onmessage = async(event) => {
                setWsStatus(ws.readyState)
                const data = JSON.parse(event.data)

                try{
                    // heartbeat response
                    if (data.type !== "heartbeat-response"){

                        if (data.type == "answer") {
                            // answer from offer sent to create peer connection
                            console.log('ws answer')
                            if (pcRef.current.signalingState == 'have-local-offer'){  // check valid state, and not react re-render
                                console.log(pcRef.current.signalingState)
                                await pcRef.current.setRemoteDescription(new RTCSessionDescription({
                                    type: data.type,
                                    sdp: data.sdp
                                }));
                            }
                        }

                        else if (data.type == "ice-candidate") { 
                            // received new ice candidate from backend, add to connection and try to use it
                            console.log('ws ice-candidate')
                            await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
                        }

                        else if (data.type == "error") {
                            console.log(`ws server error: ${data.message}`)
                        }

                        else if (data.type == "remote-stats"){
                            setRemoteStats(data)
                        }

                        else if (data.type == "recording-saved"){
                            console.log('recording-saved')
                            console.log(data)
                            // setFileList([...fileList, {"title": data["filename"], "thumbnail": data["thumbnail"]}])
                            setFileList(prev => [...prev, {"title": data["filename"], "thumbnail": data["thumbnail"]}])
                            console.log(fileList)
                        }
                    }
                }
                catch (error) {
                    console.error(`error handling ws message: ${error}`)
                    console.log(data)
                }
            }

            ws.onerror = (event) => {
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

                // if (wsRef.current !== ws) return;  // ignore stale sockets

                // attempt reconnect after 5 seconds
                setTimeout(() => {
                    connectWs();
                }, 5000);
            }
        }
        catch (error){
            console.log(`error opening websocket: ${error}`)
        }
    }


    const connectPc = async() => {
        console.log('attempting to connect stream via peer connection...')
        const pc = new RTCPeerConnection({ "iceServers": iceServers, "iceTransportPolicy": "all" });
        pcRef.current = pc;

        pc.addTransceiver("video", {direction: "recvonly"});
        pc.addTransceiver("audio", {direction: "recvonly"});

        pc.ontrack = async (event) => {
            console.log('pc.ontrack');
            const track = event.track;
            if (track.kind == 'video') {
                console.log('pc.video track added');
                videoRef.current.srcObject = event.streams[0];
                videoRef.current.muted = true;  // ensure sound is coming from audio stream not video stream
            } else if (track.kind == 'audio') {
                console.log('pc.audio track added');
                
                // here

                // const audioContext = new AudioContext();
                let  audioContext = audioContextRef.current;

                if (audioContext.state === "suspended") {
                    await audioContext.resume();
                    console.log("AudioContext resumed:", audioContext.state);
                }

                const source = audioContext.createMediaStreamSource(event.streams[0]);
                const analyser = audioContext.createAnalyser();
                analyserRef.current = analyser;
                const gainNode = audioContext.createGain();
                gainNode.gain.value = volume / 100;
                gainRef.current = gainNode;

                const filterLow = audioContext.createBiquadFilter();
                filterLow.type = "highpass";
                filterLowRef.current = filterLow;
                filterLow.frequency.value = lowerCutoff;  // cutoff frequency

                const filterHigh = audioContext.createBiquadFilter();
                filterHigh.type = "lowpass";
                filterHighRef.current = filterHigh;
                filterHigh.frequency.value = upperCutoff;  // cutoff frequency

                source.connect(gainNode);
                gainNode.connect(filterLow);
                filterLow.connect(filterHigh);
                filterHigh.connect(analyser);
                analyser.connect(audioContext.destination)  // connects audio context to speakers

                // to here
                
                setAudioStream(event.streams[0])
            }

        }

        pc.onicecandidate = (event) => {  // fires for every candidate as discovered, and a final time where candidate=null to signal end of gathering
        // Every time I discover a new way for someone to reach me, send info to other peer so they can try connecting to it
            console.log('pc.onicecandidate');
            if (event.candidate && wsRef.current) {  // don't fire on final candidate=null, make sure websocket is open
                if (wsRef.current.readyState == WebSocket.OPEN){
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
        }

        try{
            // browser sends an offer first, backend processes the offer
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
        console.log('ws pc teardown')
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
    }


    useEffect(() => {
        connectWs();
        return () => {
            teardown()
        }
    },[ip, port]);


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