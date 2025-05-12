import { Canvas } from "@react-three/fiber";
import "./Experience.css";
import Corridor from "./Components/Corridor/Corridor";
import Ring from "./Components/Ring/Ring";
import Player from "./Components/Player/Player";
import { baseRingSpeed, mainCorridorSpinSpeed } from "./constants";
import { useEffect, useMemo, useState, useRef } from "react";
import Points from "./Components/Points/Points";
import StartScreen from "./Components/StartScreen/StartScreen";
import WinScreen from "./Components/WinScreen/WinScreen";

const levelOneLength = 162;
const levelOneRingCount = 10;

export default function Experience() {
  const [points, setPoints] = useState(0);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const [scoreToWin, setScoreToWin] = useState(0);
  const startScreenRef = useRef(null);

  useEffect(() => {
    console.log("points changed", points);
  }, [points]);

  // UseMemo to prevent relocation of rings on state update
  const ringConfigs = useMemo(() => {
    return Array.from({ length: levelOneRingCount }).map(() => {
      const random = Math.random();
      const radius = random * 8 + 1;
      const maxOffset = 7 * (1 - (radius - 2) / 8);
      const zPosition = (Math.random() * 2 - 1) * maxOffset;
      random >= 0.25 && setScoreToWin((prev) => prev + 1); 

      return {
        random,
        radius,
        zPosition,
        yPosition: random * levelOneLength - levelOneLength / 2,
        color: random >= 0.25 ? "gold" : "red",
        type: random <= 0.25 ? "coin" : "damage",
        onCollision:
          random >= 0.25
            ? () => setPoints((p) => p + 1)
            : () => setPoints((p) => p - 1),
      };
    });
  }, []);

  const handleWin = () => {
    console.log("You win!");
    setWon(true);
  };

  useEffect(() => {
    if (points === scoreToWin) {
      handleWin();
    }
  }, [points]);

  const startGame = () => {
    setStarted(true);
  };

  useEffect(() => {
    if (!started) {
      const handleKeyDown = () => startGame();
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [started]);

  return (
    <div className="mainExperienceDiv">
      <Points score={points} scoreToWin={scoreToWin} />
      <>
        <WinScreen won={won} />
        <StartScreen
          startGame={startGame}
          started={started}
          startScreenRef={startScreenRef}
        />

            <Canvas
              className="canvas"
              onCreated={(state) => {
                state.camera.position.set(0, 0, 50);
              }}
            >
              {/* <axesHelper args={[15]} /> */}
              <ambientLight />
              <Player />
              <Corridor speed={mainCorridorSpinSpeed} length={levelOneLength}>
                {ringConfigs.map((config, i) => {
                  const { radius, zPosition, yPosition } = config;
                  return (
                    <Ring
                      key={i}
                      ringType={{
                        color: config.color,
                        type: config.type,
                      }}
                      onCollision={config.onCollision}
                      speedX={config.random * baseRingSpeed}
                      speedY={config.random * baseRingSpeed}
                      radius={radius}
                      tube={0.25}
                      position={[
                        0, // same as z for this since we are in rotated tube.. using z instead.
                        yPosition, // Fill tube from start to finish
                        zPosition, // distance from center of corridor
                      ]}
                    />
                  );
                })}
              </Corridor>
            </Canvas>
          </>
    </div>
  );
}
