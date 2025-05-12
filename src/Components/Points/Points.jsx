import { useEffect, useState } from "react";

export default function Points({ score, scoreToWin }) {
    const [fontSize, setFontSize] = useState(12)
    const [displayScore, setDisplayScore] = useState(score)

    useEffect(() => {
        if (score !== displayScore) {
            console.log("score changed", score)
            setFontSize(34)
            setDisplayScore(score)
            setTimeout(() => {
                setFontSize(12)
            }, 1200)
        }
    }, [score])
    
  return (
    <div
      style={{
        color: score === scoreToWin ? "green" : "red",
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 1000,
        backgroundColor: "white",
        padding: "0 10px",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <p>Rings: <span style={{ fontSize }}>{displayScore}</span> / {scoreToWin}</p>
    </div>
  );
}
