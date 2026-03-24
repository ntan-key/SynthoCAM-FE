import Navbar from "./components/Navbar"
import Stream from "./components/Stream"

function App() {

  return (
    <div className="h-screen min-w-screen flex flex-col bg-linear-to-r from-bg-start via-bg-mid to-bg-stop">
      <Navbar></Navbar>
      <Stream></Stream>
    </div>
  )
}

export default App
