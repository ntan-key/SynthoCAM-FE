import { useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from "./AppContext";
import Toolbar from './Toolbar';
import Stats from './Stats';


const Stream = () => {
    const { videoRef, audioRef } = useContext(AppContext);
    const containerRef = useRef(null);
    const [fullScreen, setFullScreen] = useState(false);
    const audioElement = document.getElementById('audio-element');


    const onFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        else {
            containerRef.current.requestFullscreen();
        }
        setFullScreen(!fullScreen);
    }


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Tempory to see where lag is coming form  - to be removed. 


    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
      
        const id = window.setInterval(() => {
          const q = video.getVideoPlaybackQuality?.();
          console.log("VIDEO DEBUG", {
            currentTime: video.currentTime,
            readyState: video.readyState,
            paused: video.paused,
            width: video.videoWidth,
            height: video.videoHeight,
            droppedVideoFrames: q?.droppedVideoFrames,
            totalVideoFrames: q?.totalVideoFrames,
          });
        }, 1000);
      
        return () => clearInterval(id);
      }, [videoRef]);

      useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
      
        const events = ["loadstart", "loadedmetadata", "loadeddata", "canplay", "playing", "waiting", "stalled"];
      
        const handlers = events.map((eventName) => {
          const handler = () => console.log("VIDEO EVENT", eventName, {
            currentTime: video.currentTime,
            readyState: video.readyState,
          });
          video.addEventListener(eventName, handler);
          return { eventName, handler };
        });
      
        return () => {
          handlers.forEach(({ eventName, handler }) => {
            video.removeEventListener(eventName, handler);
          });
        };
      }, [videoRef]);
      

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // End of Temp

    
    return (
      <div ref={containerRef} className='flex-1 min-h-0 relative rounded-xl border border-border overflow-hidden'>
        {/* relative is needed to overlay Stats and Toolbar
          overflow-hidden means the image fills the container to the edges and crops anything that exceeds it*/}
          <Stats></Stats>
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`h-full w-full rounded-xl opacity-100 object-cover transition-opacity duration-500`}
          />
           {/*h-full is required in the video component to make sure the video fills the surrounding div,
            and Stats and Toolbar are properly overlayed */}
          <Toolbar fullScreen={fullScreen} setFullScreen={setFullScreen} onFullScreen={onFullScreen}></Toolbar>
      </div>   
    )
}

export default Stream;