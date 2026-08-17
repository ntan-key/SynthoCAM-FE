import { AppContext } from "./AppContext";
import { useRef, useState, useEffect, useContext } from "react";


const FilenameInput = () => {

    const { filenameState } = useContext(AppContext);
    const [ filename, setFilename ] = filenameState;

    // used for responsive resize of video title input
    const inputRef = useRef(null);
    const measureRef = useRef(null);


    const resize = () => {
        let text = filename || inputRef.current.placeholder;
        text = text.replace(/ +$/g, (spaces) =>  // handle ending on whitespace resizing
        "\u00A0".repeat(spaces.length)
        );
        measureRef.current.textContent = text;
        inputRef.current.style.width = measureRef.current.offsetWidth + 2 +"px";
    }


    useEffect(() => {
        resize()
      }, [filename])


    return (
        <div className="w-full h-10 flex border border-border rounded-sm p-1 text-white font-bold text-2xl">
            <input 
                ref={inputRef} 
                value={filename} 
                type='text' 
                placeholder='Video Title' 
                className="w-content outline-none overflow-hidden" 
                onChange={(e) => setFilename(e.target.value)}
            >
            </input>
            <span className="text-white">.mp4</span>
            <span ref={measureRef} className="" style={{visibility: "hidden"}}></span>
        </div>
    )
}


export default FilenameInput;