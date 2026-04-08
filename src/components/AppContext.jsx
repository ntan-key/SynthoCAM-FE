import { createContext, useState, useRef, useEffect } from "react";


export const AppContext = createContext(null);

export const AppContextProvider = ({ip, port, children}) => {
    const wsRef = useRef(null);
    const [wsStatus, setWsStatus] = useState(3);
    
    const pcRef = useRef(null);
    const [pcStatus, setPcStatus] = useState('disconnected');
    
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const [ audioStream, setAudioStream ] = useState(null);
    const [remoteStats, setRemoteStats] = useState(null);

    const [record, setRecord] = useState(false);
    const [filename, setFilename] = useState('');


    const iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ];
    
    const connectWs = () => {
        console.log('attempting to connect to websocket...')
        let heartbeatInterval = null;
        const ws = new WebSocket(`ws://${ip}:${port}`);
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


    const connectPc = async() => {
        console.log('attempting to connect stream via peer connection...')
        const pc = new RTCPeerConnection({ "iceServers": iceServers, "iceTransportPolicy": "all" });
        pcRef.current = pc;

        pc.ontrack = (event) => {
            console.log('pc.ontrack');
            const track = event.track;
            if (track.kind == 'video') {
                console.log('pc.video track added');
                videoRef.current.srcObject = event.streams[0];
            } else if (track.kind == 'audio') {
                console.log('pc.audio track added');
                audioRef.current.srcObject = event.streams[0];
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
            const offer = await pc.createOffer({
                offerToReceiveVideo: true,
                offerToReceiveAudio: true
            });
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
            recordState: [record, setRecord],
            filenameState: [filename, setFilename],
        }}>
            {children}
        </AppContext.Provider>
    )
};