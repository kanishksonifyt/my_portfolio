import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./Navbar";
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

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    // FIX: Changed w-[99vw] to w-screen and h-fit to h-screen
    <div className="w-screen h-screen bg-black text-white overflow-hidden cursor-none relative">
      
      {/* Navbar Container - Absolute to sit on top */}
      <div className="absolute top-0 left-0 w-full z-50 pointer-events-none">
        {/* Navbar */}
        <span className="fixed z-50 flex left-1/2 -translate-x-1/2 pointer-events-auto">
          <Navbar />
        </span>
        
        {/* 3D Model */}
        <span className="w-fit max-sm:hidden fixed md:ml-[80%] lg:ml-[80%] z-[9999] flex justify-end items-center px-3 max-md:pt-16 max-md:justify-center pointer-events-auto">
          <First3dmodel />
        </span>
      </div>

      {/* Main Content - Centered and Full Size */}
      <div className="w-full h-full flex justify-center items-center">
        {isSmallScreen ? <Phoneview /> : <Computerview />}
      </div>
    </div>
  );
};

export default Home;