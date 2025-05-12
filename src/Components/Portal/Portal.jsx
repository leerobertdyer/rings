import { DEG90 } from "../../constants";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";

export default function Portal({ type }) {
    console.log(type)
    const matcapTexture = useTexture("/textures/cat.png");
    const [collided, setCollided] = useState(false);
    const { camera } = useThree();

    const portalRef = useRef();

    useFrame(() => {
        if (portalRef.current) {
            const portalPosition = new THREE.Vector3();
            portalRef.current.getWorldPosition(portalPosition);
            const playerPosition = camera.position;
            const distance = portalPosition.distanceTo(playerPosition);
            if (distance < 20) {
                setCollided(true);
            }
        }
        if (collided) {
            setCollided(false);
            camera.position.set(0, 0, 50);
        }
    })

    return (
        <mesh ref={portalRef} rotation={[DEG90, 0, 0]} position={[0, 80, 0]}>
            <circleGeometry args={[20, 32, 32]}/>
            <meshMatcapMaterial matcap={matcapTexture} side={THREE.DoubleSide}/>
        </mesh>
    )
}