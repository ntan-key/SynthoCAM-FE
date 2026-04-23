import { AppContextProvider } from "./components/AppContext";
import AppContainer from "./components/AppContainer";


function App() {  

  // const RPI_IP = '192.168.0.131';  // KEY
  // const RPI_IP = '192.168.0.146';  // Home
  // const RPI_IP = '10.42.0.1';  // Static
  // const RPI_IP = '172.16.10.45';  // SynthoGuest
  const RPI_IP = '172.16.10.46';  // SynthoGuest2
  const WEBSOCKET_PORT = 8000;  // 5173


  // document.addEventListener("click", async () => {
  //     const ctx = audioContextRef.current;
  //     if (ctx.state === "suspended") {
  //         await ctx.resume();
  //     }
  // });

  // document.addEventListener("touchstart", async () => {
  //     if (audioContextRef.current.state === "suspended") {
  //         await audioContextRef.current.resume();
  //     }
  // }, { once: true });


  return (
    <AppContextProvider ip={RPI_IP} port={WEBSOCKET_PORT}>
      <AppContainer></AppContainer>
    </AppContextProvider>
  )
}

export default App

// npm run dev -- --host