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
import Lives from "./Components/Lives/Lives";
import LostScreen from "./Components/LostScreen/LostScreen";
import Portal from "./Components/Portal/Portal";

const levelOneLength = 162;
const levelOneRingCount = 15;

export default function Experience() {
  const [points, setPoints] = useState(0);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [started, setStarted] = useState(false);
  const [totalGoodRings, setTotalGoodRings] = useState(0);
  const [scoreToWin, setScoreToWin] = useState(0);
  const [lives, setLives] = useState(3);
  const [hit, setHit] = useState(false);
  const [hitKey, setHitKey] = useState(0);
  const startScreenRef = useRef(null);
  const handicap = 2;
  

  useEffect(() => {
    if (hit) {
      setTimeout(() => {
        setHit(false);
      }, 1000);
    }
  }, [hit]);

  useEffect(() => {
    console.log("points changed", points);
  }, [points]);

  function handleCollision(type) {
    if (type === "good") {
      setPoints((p) => p + 1);
    } else if (type === "damage") {
      setLives((l) => l - 1);
      setHit(true);
      setHitKey(Date.now());
    }
  }

  // UseMemo to prevent relocation of rings on state update
  const ringConfigs = useMemo(() => {
    // First, create the rings with their properties
    const rings = Array.from({ length: levelOneRingCount }).map(() => {
      const random = Math.random();
      let radius;
      
      // Use different distribution approaches based on random value
      if (random < 0.4) {
        // Small rings 
        radius = 1 + (random);
      } else if (random < 0.9) {
        // Medium rings 
        radius = 3 + ((0.5 * random) * 2 / 0.8);
      } else {
        // Large rings 
        radius = 6 + ((0.25 * random) * 4 / 0.3);
      }
      
      const maxOffset = 7 * (1 - (radius - 2) / 8);
      const zPosition = (Math.random() * 2 - 1) * maxOffset;
      
      // Determine if this is a "good" ring
      const isGood = Math.random() >= 0.25;
      isGood && setTotalGoodRings((prev) => prev + 1);
      
      return {
        random,
        radius,
        zPosition,
        color: isGood ? "gold" : "red",
        type: isGood ? "coin" : "damage",
        onCollision: isGood
          ? () => handleCollision("good")
          : () => handleCollision("damage"),
      };
    });
    
    // Now create positions separately
    const positions = Array.from({ length: levelOneRingCount }).map(() => {
      // More controlled positioning to ensure all rings are reachable
      // Define the range explicitly
      const minPosition = -levelOneLength/2 + 10; // Start 10 units in
      const maxPosition = levelOneLength/2 - 20;  // End 20 units before the end
      
      // Generate a position within this explicit range
      return minPosition + (Math.random() * (maxPosition - minPosition));
    });
    
    // Fisher-Yates shuffle algorithm to randomize the positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Finally, assign the randomized positions to the rings
    return rings.map((ring, index) => ({
      ...ring,
      yPosition: positions[index],
    }));
  }, []);
  console.log(ringConfigs)

  useEffect(() => {
    setScoreToWin(totalGoodRings - handicap);
  }, [totalGoodRings]);

  function handleWin() {
    console.log("You win!");
    setWon(true);
  }

  function handleLose() {
    console.log("DIED!")
    setLost(true);
  }

  useEffect(() => {
    if (lives === 0) {
      handleLose();

    } else if (points === scoreToWin) {
      if (points > 1) {
        handleWin();
      }
    }
  }, [points, lives, scoreToWin]);

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
      {hit && <div key={hitKey} className="hit"></div>}
      <Lives lives={lives} />
      <Points score={points} scoreToWin={scoreToWin} />
      <>
        <WinScreen won={won} />
        {lost && <LostScreen lost={lost} />}
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
              <Player lives={lives}/>
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
                      tube={0.15}
                      position={[
                        0, // same as z for this since we are in rotated tube.. using z instead.
                        yPosition, // Fill tube from start to finish
                        zPosition, // distance from center of corridor
                      ]}
                    />
                  );
                })}
                <Portal type="end" />
              </Corridor>
            </Canvas>
          </>
    </div>
  );
}
