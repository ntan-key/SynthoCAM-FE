import { WebSocketProvider } from "./components/WebSocketContext";
import Navbar from "./components/Navbar"
import Stream from "./components/Stream"


function App() {

  const RPI_IP = '192.168.0.131';
  const WEBSOCKET_PORT = 5927;

  return (
    <WebSocketProvider ip={RPI_IP} port={WEBSOCKET_PORT}>
      <div className="h-screen min-w-screen flex flex-col bg-linear-to-r from-bg-start via-bg-mid to-bg-stop">
        <Navbar></Navbar>
        <Stream></Stream>
      </div>
    </WebSocketProvider>
  )
}

export default App
