import { useFrame } from "@react-three/fiber";
import { NEG90 } from "../../constants";
import * as THREE from "three";
import { useRef } from "react";
const topRadius = 20
const bottomRadius = 20
const radialSegments = 32
const heightSegments = 32

export default function MainRing({ children, speed, length }) {
    const mainRingRef = useRef();

    useFrame(() => {
        mainRingRef.current.rotation.y += speed;
    })

  return (
    <mesh ref={mainRingRef} rotation={[NEG90, 0, 0]} position={[0, 0, -50]}>
      <cylinderGeometry args={[topRadius, bottomRadius, length, radialSegments, heightSegments]} />
      <meshBasicMaterial color="#AA00AA" wireframe={true} side={THREE.DoubleSide}/>
      {children}
    </mesh>
  );
}
