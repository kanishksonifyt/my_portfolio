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
          camera={{ near: 0.1, far: 1000 }}
        >
          <Suspense fallback={<Loader />}>
            <directionalLight intensity={0.5} position={[10, 10, 5]} />
            <ambientLight intensity={1.1} />
            <pointLight intensity={0.5} position={[-10, -10, -5]} />
            <spotLight intensity={0.6} position={[5, 5, 5]} angle={0.8} />
            <hemisphereLight intensity={0.5} />
            <OrbitControls />
            <ComputersCanvas position={[0, 0, 0]} scale={[0.1, 0.1, 0.1]} />
          </Suspense>
        </Canvas>
      </section>
    </div>
  );
};

export default First3dmodel;
