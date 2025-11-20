import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three"; // Import THREE for math utils
import ComputersCanvas from "./Computer";
import Loader from "../components/Loader";

// --- 1. NEW COMPONENT: Handles the mouse following logic ---
const ModelRig = ({ children }) => {
  const group = useRef();

  useFrame((state) => {
    // state.mouse.x and .y are normalized coordinates (-1 to +1)
    
    // Calculate target rotation
    // Multiply by values (e.g., 0.5) to control sensitivity/range of motion
    const targetRotationX = -state.mouse.y * 0.5; 
    const targetRotationY = state.mouse.x * 0.5;

    // Apply Smooth Rotation (Lerp)
    // 0.1 is the smoothing factor (lower = smoother/slower, higher = snappier)
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        targetRotationX,
        0.1
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        targetRotationY,
        0.1
      );
    }
  });

  return <group ref={group}>{children}</group>;
};

const First3dmodel = () => {
  const [hideModel, setHideModel] = useState(
    typeof window !== "undefined" &&
      sessionStorage.getItem("fullscreenVideoActive") === "true"
  );

  useEffect(() => {
    const checkFullscreen = () => {
      const active =
        typeof window !== "undefined" &&
        sessionStorage.getItem("fullscreenVideoActive") === "true";
      setHideModel(active);
    };
    window.addEventListener("storage", checkFullscreen);
    const interval = setInterval(checkFullscreen, 300);
    return () => {
      window.removeEventListener("storage", checkFullscreen);
      clearInterval(interval);
    };
  }, []);

  const fadeClass = hideModel
    ? "opacity-0 pointer-events-none transition-opacity duration-500"
    : "opacity-100 transition-opacity duration-500";

  if (hideModel) return null;

  return (
    <div className={`w-fit ${fadeClass}`}>
      <section className="w-full h-[300px] relative">
        <Canvas
          className="w-full h-screen bg-transparent"
          camera={{ near: 0.1, far: 1000 }}
        >
          <Suspense fallback={<Loader />}>
            <directionalLight intensity={0.5} position={[10, 10, 5]} />
            <ambientLight intensity={1.1} />
            <pointLight intensity={0.5} position={[-10, -10, -5]} />
            <spotLight intensity={0.6} position={[5, 5, 5]} angle={0.8} />
            <hemisphereLight intensity={0.5} />

            {/* 2. WRAP MODEL IN RIG & REMOVE ORBIT CONTROLS */}
            <ModelRig>
              <ComputersCanvas position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]} />
            </ModelRig>
            
          </Suspense>
        </Canvas>
      </section>
    </div>
  );
};

export default First3dmodel;