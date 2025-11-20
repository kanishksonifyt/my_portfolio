<<<<<<< HEAD
import { Suspense, useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
// Import the WebGPU Renderer (Standard path for three.js installed via npm)
import WebGPURenderer from "three/examples/jsm/renderers/webgpu/WebGPURenderer.js";
import ComputersCanvas from "./Computer";
import Loader from "../components/Loader";

// --- Rig Component for Smooth Mouse Follow ---
const ModelRig = ({ children }) => {
  const group = useRef();
  useFrame((state) => {
    const targetRotationX = -state.mouse.y * 0.5;
    const targetRotationY = state.mouse.x * 0.5;
    if (group.current) {
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.1);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.1);
    }
  });
  return <group ref={group}>{children}</group>;
=======
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import ComputersCanvas from "./Computer";
import Loader from "../components/Loader";

const draggableStyle = {
  cursor: "grab",
  // cursor: 'url(images/grab.cur), grab',
};

const activeDraggableStyle = {
  cursor: "url(images/grabbing.cur), grabbing",
>>>>>>> parent of a9860d3 (Refactor Contact, Home, and Projects components for improved UX and functionality)
};

const First3dmodel = () => {
  const [isDragging, setIsDragging] = useState(false);
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
    // Listen for storage changes and also check on mount
    window.addEventListener("storage", checkFullscreen);
    const interval = setInterval(checkFullscreen, 300); // Poll for session changes
    return () => {
      window.removeEventListener("storage", checkFullscreen);
      clearInterval(interval);
    };
  }, []);

  // Fade animation classes
  const fadeClass = hideModel
    ? "opacity-0 pointer-events-none transition-opacity duration-500"
    : "opacity-100 transition-opacity duration-500";

  if (hideModel) return null;

  return (
    <div
      className={`w-fit cursor-grab ${fadeClass}`}
      style={isDragging ? activeDraggableStyle : draggableStyle}
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      <section className="w-full h-[300px] relative ">
        <Canvas
          className="w-full h-screen bg-transparent"
          shadows
          camera={{ near: 0.1, far: 1000 }}
          // --- WEBGPU CONFIGURATION ---
          gl={async (props) => {
            // 1. Check if Browser supports WebGPU
            if (navigator.gpu) {
              try {
                const renderer = new WebGPURenderer(props);
                await renderer.init();
                return renderer;
              } catch (e) {
                console.warn("WebGPU init failed, falling back to WebGL");
                return new THREE.WebGLRenderer(props);
              }
            } else {
              // 2. Fallback for older devices
              return new THREE.WebGLRenderer(props);
            }
          }}
        >
          <Suspense fallback={<Loader />}>
            <directionalLight intensity={0.5} position={[10, 10, 5]} />
            <ambientLight intensity={1.1} />
            <pointLight intensity={0.5} position={[-10, -10, -5]} />
            <spotLight intensity={0.6} position={[5, 5, 5]} angle={0.8} />
            <hemisphereLight intensity={0.5} />
<<<<<<< HEAD

            <ModelRig>
              <ComputersCanvas position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]} />
            </ModelRig>
            
=======
            <OrbitControls />
            <ComputersCanvas position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]} />
>>>>>>> parent of a9860d3 (Refactor Contact, Home, and Projects components for improved UX and functionality)
          </Suspense>
        </Canvas>
      </section>
    </div>
  );
};

export default First3dmodel;
