import { useContext, useEffect } from "react";
import { AppContext } from "./AppContext";

export default function Comp({ children }){
    const { statusState2 } = useContext(AppContext);

    const [ status, setStatus ] = statusState2;

    useEffect(() => {
      fetch("http://localhost:8000/")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => setStatus(data.status))
      .catch((error) => {
        console.error("Error fetching status:", error)
        setStatus('error')
      })
    }, [])

    return (
        <h1>{status}</h1>
    )
}