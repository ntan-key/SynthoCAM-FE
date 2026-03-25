import { WebSocketProvider } from "./components/WebSocketContext";
import Navbar from "./components/Navbar"
import Stream from "./components/Stream"

import { useEffect, useState } from "react";
import { AppContext } from "./components/AppContext";
import Comp from "./components/Comp";


function App() {

  // const RPI_IP = '192.168.0.131';
  // const WEBSOCKET_PORT = 5927;

  const [status, setStatus] = useState('initial');
  const [status2, setStatus2] = useState('initial2');

  // useEffect(() => {
  //   fetch("http://localhost:8000/status")
  //   .then((res) => {
  //     if (!res.ok) throw new Error("Network response was not ok");
  //     return res.json();
  //   })
  //   .then((data) => setStatus(data.status))
  //   .catch((error) => {
  //     console.error("Error fetching status:", error)
  //     setStatus('error')
  //   })
  // }, [])

  return (
    <AppContext.Provider value={{statusState: [status, setStatus], statusState2: [status2, setStatus2]}}>
      <Comp></Comp>
      <p>{status}</p>
    </AppContext.Provider>
    // <WebSocketProvider ip={RPI_IP} port={WEBSOCKET_PORT}>
    //   <div className="h-screen min-w-screen flex flex-col bg-linear-to-r from-bg-start via-bg-mid to-bg-stop">
    //     <Navbar></Navbar>
    //     <Stream></Stream>
    //   </div>
    // </WebSocketProvider>
  )
}

export default App
