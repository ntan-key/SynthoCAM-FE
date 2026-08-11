import { AppContextProvider } from "./components/AppContext";
import AppContainer from "./components/AppContainer";


function App() {  
  const RPI_IP = '10.42.0.1';  // Static
  const WEBSOCKET_PORT = 8000;  // 5173
  // const RPI_IP = window.location.host;

  
  return (
    <AppContextProvider ip={RPI_IP} port={WEBSOCKET_PORT}>
      <AppContainer></AppContainer>
    </AppContextProvider>
  )
}

export default App

// npm run dev -- --host