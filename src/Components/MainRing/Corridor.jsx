import { useFrame } from "@react-three/fiber";
import { mainCorridorSpinSpeed, NEG90 } from "../../constants";
import * as THREE from "three";
import { useRef } from "react";
const topRadius = 10
const bottomRadius = 10
const height = 100
const radialSegments = 32
const heightSegments = 32

export default function MainRing({ children }) {
    const mainRingRef = useRef();

    useFrame(() => {
        // mainRingRef.current.rotation.y += mainCorridorSpinSpeed;
    })

  return (
    <mesh ref={mainRingRef} rotation={[NEG90, 0, 0]} position={[0, 0, -52]}>
      <cylinderGeometry args={[topRadius, bottomRadius, height, radialSegments, heightSegments]} />
      <meshBasicMaterial color="#AA00AA" wireframe={true} side={THREE.DoubleSide}/>
      {children}
    </mesh>
  );
}
