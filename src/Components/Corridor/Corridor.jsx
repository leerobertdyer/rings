import { useFrame, useThree } from "@react-three/fiber";
import { NEG90 } from "../../constants";
import * as THREE from "three";
import { useRef } from "react";
const topRadius = 20
const bottomRadius = 20
const radialSegments = 32
const heightSegments = 32

export default function MainRing({ children, corriderSpinSpeed, length }) {

    const mainRingRef = useRef();
    const { camera } = useThree();

    useFrame(() => {
      if (mainRingRef.current) {
        mainRingRef.current.rotation.y += corriderSpinSpeed;

        // Calculate distance from center using Pythagorean theorem
        const distanceFromCenter = Math.sqrt(
          camera.position.x * camera.position.x + 
          camera.position.y * camera.position.y
        );

        // console.log("distanceFromCenter", distanceFromCenter);
        
        // Calculate normalized distance (0 = center, 1 = at boundary)
        const normalizedDistance = distanceFromCenter / topRadius;

        // console.log("normalizedDistance", normalizedDistance);
        
        // Only apply logic when getting close to boundary
        if (normalizedDistance > 0.9) {
          // invert x and y axis
          camera.position.x = -camera.position.x;
          camera.position.y = -camera.position.y;
        }
      }
    })

  return (
    <mesh ref={mainRingRef} rotation={[NEG90, 0, 0]} position={[0, 0, -50]}>
      <cylinderGeometry args={[topRadius, bottomRadius, length, radialSegments, heightSegments]} />
      <meshBasicMaterial color="#AA00AA" wireframe={true} side={THREE.DoubleSide}/>
      {children}
    </mesh>
  );
}
