import { useFrame, useThree } from "@react-three/fiber";
import { DEG90 } from "../../constants";
import { useRef, useState } from "react";
import * as THREE from "three";
import { MeshReflectorMaterial } from "@react-three/drei";

const radialSegments = 32
const heightSegments = 32


export default function Ring({ speedX, speedY, radius, tube, position, onCollision, ringType }) {
    const ringRef = useRef();
    const { camera } = useThree();
    const [collided, setCollided] = useState(false);
    
    useFrame(() => {
        if (ringRef.current) {
            ringRef.current.rotation.y += speedY;
            ringRef.current.rotation.x += speedX;
            
            // Get world position of the ring
            const ringPosition = new THREE.Vector3();
            ringRef.current.getWorldPosition(ringPosition);
            
            // Calculate distance between camera and ring center
            const distance = camera.position.distanceTo(ringPosition);
            
            // Collision detected if distance is less than ring radius plus some buffer
            // The buffer accounts for the player's size
            const collisionThreshold = radius + 0.5;
            
            // Check for collision (only register once)
            if (!collided && distance < collisionThreshold) {
                setCollided(true);
                onCollision && onCollision();
            }
            
            // Reset collision state if player moves away (optional)
            if (collided && distance > collisionThreshold * 1.5) {
                setCollided(false);
            }
        }
    })

    return !collided && (
        <mesh ref={ringRef} rotation={[DEG90, 0, 0]} position={position}>
            <torusGeometry args={[radius, tube, radialSegments, heightSegments]}/>
            <MeshReflectorMaterial color={ringType.color} wireframe={false}/>
        </mesh>
    )
}