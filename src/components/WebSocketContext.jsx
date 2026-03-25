// WebSocketContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from "react";


const WebSocketContext = createContext(null);
export const useWebSocket = () => useContext(WebSocketContext);

const iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ];


export const WebSocketProvider = ({ ip, port, children }) => {
    const wsRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const [message, setMessage] = useState([]);


    const initializeWebRTC = async () => {
        try {
            const pc = new RTCPeerConnection({ "iceServers": iceServers, "iceTransportPolicy": "all" });
            peerConnectionRef.current = pc;

            pc.ontrack = (event) => {
                console.log('ontrack')
                const track = event.track;

                if (track.kind === 'video' && remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = event.streams[0];
                } else if (track.kind === 'audio' && remoteAudioRef.current) {
                    remoteAudioRef.current.srcObject = event.streams[0];
                    remoteAudioRef.current.volume = 0.8;
                }
            };

            pc.onicecandidate = (event) => {
                if (event.candidate && wsRef.current) {
                    wsRef.current.send(JSON.stringify({
                        type: 'ice-candidate',
                        candidate: event.candidate
                    }));
                }
            };

            pc.onconnectionstatechange = () => {
                const state = pc.connectionState;
                console.log(state)

                // if (state === 'connected') {
                //     setIsConnected(true);
                //     setIsConnecting(false);
                // } else if (state === 'failed') {
                //     setError('WebRTC connection failed');
                //     setIsConnecting(false);
                // } else if (state === 'disconnected' || state === 'closed') {
                //     setIsConnected(false);
                // }
            };

            const offer = await pc.createOffer({
                offerToReceiveVideo: true,
                offerToReceiveAudio: true
            });
            await pc.setLocalDescription(offer);

            // await new Promise(resolve => {
            //     if (pc.iceGatheringState === "complete") {
            //         resolve();
            //     } else {
            //         pc.onicegatheringstatechange = () => {
            //             if (pc.iceGatheringState === "complete") resolve();
            //         };
            //     }
            // });

            wsRef.current.send(JSON.stringify({
                type: 'offer',
                sdp: offer.sdp
            }));

        } 
        catch (error) {
            // setError('Failed to initialize WebRTC');
            // setIsConnecting(false);
            console.log(error)
        }
    };


    const handleSignalingMessage = async (data) => {
        try {
            const pc = peerConnectionRef.current;

            if (data.type === 'answer') {
                console.log('answer')
                await pc.setRemoteDescription(new RTCSessionDescription({
                    type: data.type,
                    sdp: data.sdp
            }));
            } else if (data.type === 'ice-candidate') {
                await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
            } else if (data.type === 'error') {
                console.log(`Server error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error handling signaling message:', error);
        }
    };


    const disconnect = () => {
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        if (websocketRef.current) {
            websocketRef.current.close();
            websocketRef.current = null;
        }

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }

        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null;
        }
    };

    const connectRPI = async () => {
        try {
            const ws = new WebSocket(`ws://${ip}:${port}`);
            wsRef.current = ws;

            ws.onopen = async () => {
                console.log("Connected to Raspberry Pi WS");
                // await initializeWebRTC();
                await setTimeout(() => initializeWebRTC(), 0)
            }
            ws.onmessage = async (event) => {
                try {
                    const data = JSON.parse(event.data);
                    setMessage(prev => ({...prev, [data.type]: data.data,}));
                    await handleSignalingMessage(data);
                } catch (err) {
                    console.error("Invalid JSON:", event.data);
                }
            };
            // ws.onmessage = async (event) => {
            //         const data = JSON.parse(event.data);
            //         if (data.type == 'test'){
            //             console.log(data.data)
            //         }
            //         // await handleSignalingMessage(data);
            //     };
            ws.onerror = (error) => {
                console.log(error)
            }
            ws.onclose = () => console.log("WebSocket disconnected");
        } catch (error) {
            console.log(error)
        }
    }


    // useEffect(() => {
    //     const ws = new WebSocket(`ws://${ip}:${port}`);
    //     wsRef.current = ws;

    //     ws.onopen = async () => {
    //         console.log("Connected to Raspberry Pi WS");
    //         // await initializeWebRTC();
    //         await setTimeout(() => initializeWebRTC(), 0)
    //     }
    //     ws.onmessage = async (event) => {
    //         try {
    //             const data = JSON.parse(event.data);
    //             setMessage(prev => ({...prev, [data.type]: data.data,}));
    //             await handleSignalingMessage(data);
    //         } catch (err) {
    //             console.error("Invalid JSON:", event.data);
    //         }
    //     };
    //     // ws.onmessage = async (event) => {
    //     //         const data = JSON.parse(event.data);
    //     //         if (data.type == 'test'){
    //     //             console.log(data.data)
    //     //         }
    //     //         // await handleSignalingMessage(data);
    //     //     };
    //     ws.onerror = (error) => {
    //         console.log(error)
    //     }
    //     ws.onclose = () => console.log("WebSocket disconnected");

    //     return () => ws.close();
    // }, []);


    const sendMessage = (msg) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(msg));
        }
    };


    return (
        <WebSocketContext.Provider value={{ ws: wsRef.current, message, sendMessage, connectRPI, remoteAudioRef, remoteVideoRef }}>
            {children}
        </WebSocketContext.Provider>
    );
};