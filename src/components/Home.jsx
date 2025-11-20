import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import First3dmodel from "../3D-assets/First3dmodel";
import Phoneview from "./Phoneview";
import Computerview from "./Computerview";


gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    // Initial check on component mount
    handleResize();

    // Listen to window resize events
    window.addEventListener("resize", handleResize);

    // Clean up listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
<<<<<<< HEAD
    // FIX: Changed w-[99vw] to w-screen and h-fit to h-screen
    <div className="w-screen h-screen bg-black text-white overflow-hidden cursor-none relative">
      {/* Navbar Container - Absolute to sit on top */}
      <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
        {/* 3D Model */}
        <span className="w-fit max-sm:hidden fixed md:ml-[80%] lg:ml-[80%] z-[9999] flex justify-end items-center px-3 max-md:pt-16 max-md:justify-center pointer-events-auto">
=======
    <div className="w-[99vw] md:w-[98.7vw] bg-black text-white h-fit cursor-none">
      <div className="bg-black w-full overflow-x-hidden text-white h-fit">
        <span className="fixed z-50 flex left-1/2 -translate-x-1/2">
          <Navbar />
        </span>
        <span className="w-fit max-sm:hidden fixed md:ml-[80%] lg:ml-[80%] z-[9999]  flex justify-end items-center px-3 max-md:pt-16 max-md:justify-center">
>>>>>>> parent of a9860d3 (Refactor Contact, Home, and Projects components for improved UX and functionality)
          <First3dmodel />
        </span>
      </div>
      <div className="flex w-full h-fit mt-[10vh] max-md:mt-[22vh] min-h-screen flex-col justify-center items-center mb-10">
        {isSmallScreen ? <Phoneview /> : <Computerview />}
      </div>
    </div>
  );
};

export default Home;
