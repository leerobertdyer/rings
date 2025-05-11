import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils";
import "./Experience.css"

export default function Experience() {
  return (
    <div className="mainExperienceDiv">

    <Canvas className="canvas">
      <OrbitControls
        enablePan={false}
        // set the min and max polar angle (vertical height) for the camera
        minPolarAngle={degToRad(0)}
        maxPolarAngle={degToRad(90)}
        // set the min and max zoom distances for the camera
        minDistance={1}
        maxDistance={3}
        />
      <ambientLight />
      <mesh>
        <boxGeometry />
        <meshBasicMaterial color="red" />
      </mesh>
    </Canvas>
        </div>
  );
}
