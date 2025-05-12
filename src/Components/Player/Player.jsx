import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { handleMovement } from "../../movements";
import { useTexture } from "@react-three/drei";

export default function Player({ lives }) {
  const { camera } = useThree();
  const playerRef = useRef();
  // Load the texture properly using useTexture hook
  const matcapTexture = useTexture("/textures/cat.png");
  const gameOverTexture = useTexture("/textures/gameOver.png");

  // Track movement state
  const [movementState, setMovementState] = useState({
    moveForward: false,
    moveBackward: false,
    moveUp: false,
    moveDown: false,
    moveLeft: false,
    moveRight: false,
  });

  function handlePlayerMove(e) {
        // Update direction-specific movement state
        setMovementState((prevState) => handleMovement(e, prevState));
  }

  useEffect(() => {
    window.addEventListener("keydown", handlePlayerMove);
    window.addEventListener("keyup", handlePlayerMove);

    return () => {
      window.removeEventListener("keydown", handlePlayerMove);
      window.removeEventListener("keyup", handlePlayerMove);
    };
  }, []);

  // Movement speed
  const speedManipulator = lives * .08
  const speed = 0.4 - speedManipulator;

  useFrame(() => {
    if (playerRef.current) {

      // Get camera direction vectors
      const cameraDirection = new THREE.Vector3(0, 0, -1);
      cameraDirection.applyQuaternion(camera.quaternion);

      // Get right vector (perpendicular to forward direction)
      const rightVector = new THREE.Vector3(1, 0, 0);
      rightVector.applyQuaternion(camera.quaternion);

      // Create movement vector
      const moveVector = new THREE.Vector3(0, 0, 0);

      // Apply movement based on keys pressed
      if (movementState.moveUp) moveVector.y += speed;
      if (movementState.moveDown) moveVector.y -= speed;
      if (movementState.moveLeft) moveVector.x -= speed;
      if (movementState.moveRight) moveVector.x += speed;

      // For space key - move forward in the direction the camera is facing
      // But constrained to horizontal plane (no y-component)
      if (movementState.moveForward) {
        const forwardVector = new THREE.Vector3(
          cameraDirection.x,
          0,
          cameraDirection.z
        ).normalize();
        moveVector.add(forwardVector.multiplyScalar(speed));
      }

      // For / key - move backward in the direction the camera is facing
      if (movementState.moveBackward) {
        const backwardVector = new THREE.Vector3(
          cameraDirection.x,
          0,
          cameraDirection.z
        ).normalize();
        moveVector.add(backwardVector.multiplyScalar(-speed));
      }

      // Apply movement to camera
      if (moveVector.x !== 0 && lives > 0) camera.position.x += moveVector.x;
      if (moveVector.y !== 0 && lives > 0) camera.position.y += moveVector.y;
      if (moveVector.z !== 0 && lives > 0) camera.position.z += moveVector.z;

      // Position player mesh relative to camera
      const playerDistance = 1; // Distance in front of camera
      playerRef.current.position
        .copy(camera.position)
        .add(cameraDirection.multiplyScalar(playerDistance));
    }
  });

  return (
    <mesh ref={playerRef} scale={0.05}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshMatcapMaterial
        matcap={lives > 0 ? matcapTexture : gameOverTexture}
      />
    </mesh>
  );
}
