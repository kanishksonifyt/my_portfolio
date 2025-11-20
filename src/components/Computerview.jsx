/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import { motion, useDragControls } from "framer-motion";
import mypic from "../public/images/Untitled-transformed.jpeg";
import video from "/videos/workportfilio.mp4";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useSearchParams } from "react-router-dom";

import PixelTransition from "./utils/Pixelimage";
import Animation from "./Animationtest";
import housewithfishvideo from "../assets/original.mp4";
import TextTransition, { presets } from "react-text-transition";

// Lazy imports
const Clock = lazy(() => import("./Clock"));
const Projects = lazy(() => import("./Projects"));
const Contact = lazy(() => import("./Contact"));
import PropTypes from "prop-types";

gsap.registerPlugin(ScrollTrigger);
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

<<<<<<< HEAD
// --- SOUNDS ---
const grabSoundUrl = "/sounds/grab.mp3";
const dropSoundUrl = "/sounds/drop.mp3";

const BG = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Optimize for pixel art / sharp edges
    ctx.imageSmoothingEnabled = false;

    let animationFrameId;
    let width, height;
    let cx, cy;

    // Movement State
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };

    // Entities
    const stars = [];
    const debris = [];
    const numStars = 500;
    
    // Initialize Stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2,
      });
    }

    // Initialize Floating Debris
    for (let i = 0; i < 6; i++) {
      debris.push({
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        z: Math.random() * 2 + 1,
        type: Math.random() > 0.5 ? 'triangle' : 'circle'
      });
    }

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      cx = width / 2;
      cy = height / 2;
    };

    const handleMouseMove = (e) => {
      targetMouse.x = (e.clientX - cx) / (cx * 0.5); // Sensitivity
      targetMouse.y = (e.clientY - cy) / (cy * 0.5);
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        targetMouse.x = (e.touches[0].clientX - cx) / (cx * 0.5);
        targetMouse.y = (e.touches[0].clientY - cy) / (cy * 0.5);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    handleResize();

    // --- Drawing Helpers ---
    const drawDot = (x, y, size, opacity) => {
      ctx.fillStyle = `rgba(200, 255, 255, ${opacity})`;
      ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
    };

    const drawDotShape = (objX, objY, scale, type) => {
        const dotSize = 2 * scale;
        const spacing = 8 * scale;
        ctx.fillStyle = `rgba(200, 255, 255, ${Math.min(1, scale)})`;
        
        if (type === 'triangle') {
            ctx.fillRect(objX, objY - spacing, dotSize, dotSize);
            ctx.fillRect(objX - spacing/2, objY, dotSize, dotSize);
            ctx.fillRect(objX + spacing/2, objY, dotSize, dotSize);
            ctx.fillRect(objX - spacing, objY + spacing, dotSize, dotSize);
            ctx.fillRect(objX, objY + spacing, dotSize, dotSize);
            ctx.fillRect(objX + spacing, objY + spacing, dotSize, dotSize);
        } else {
            ctx.fillRect(objX, objY, dotSize, dotSize);
            ctx.fillRect(objX - spacing, objY, dotSize, dotSize);
            ctx.fillRect(objX + spacing, objY, dotSize, dotSize);
            ctx.fillRect(objX, objY - spacing, dotSize, dotSize);
            ctx.fillRect(objX, objY + spacing, dotSize, dotSize);
        }
    };

    // --- Main Render Loop ---
    const render = () => {
      // 1. Movement Physics
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // 2. Clear Screen (Black)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      // 3. Draw Stars
      stars.forEach(star => {
        star.x -= mouse.x * 10; 
        star.y -= mouse.y * 10;
        star.z -= 0.01;

        if (star.z <= 0 || Math.abs(star.x) > 3000 || Math.abs(star.y) > 3000) {
            star.z = 2;
            star.x = (Math.random() - 0.5) * 2000;
            star.y = (Math.random() - 0.5) * 2000;
        }

        const k = 200 / star.z;
        const px = cx + star.x / star.z;
        const py = cy + star.y / star.z;

        if (px > 0 && px < width && py > 0 && py < height) {
            const size = Math.max(1, (2 - star.z) * 2);
            drawDot(px, py, size, 1);
        }
      });

      // 4. Draw Debris
      debris.forEach(obj => {
          obj.z -= 0.01;
          obj.x -= mouse.x * 15;
          obj.y -= mouse.y * 15;

          if (obj.z <= 0.2) {
              obj.z = 3;
              obj.x = (Math.random() - 0.5) * 3000;
              obj.y = (Math.random() - 0.5) * 3000;
          }

          const px = cx + obj.x / obj.z;
          const py = cy + obj.y / obj.z;
          
          if (px > -100 && px < width + 100 && py > -100 && py < height + 100) {
            drawDotShape(px, py, 1/obj.z, obj.type);
          }
      });

      // 5. Draw Player Ship (Monochrome White Style)
      const shipX = cx + mouse.x * 30;
      const shipY = cy + mouse.y * 30;
      const s = 3; // pixel size scale

      ctx.fillStyle = '#ffffff';
      // Main fuselage
      ctx.fillRect(shipX - s*2, shipY - s*3, s*4, s*6);
      // Wings
      ctx.fillRect(shipX - s*4, shipY + s*1, s*2, s*2);
      ctx.fillRect(shipX + s*2, shipY + s*1, s*2, s*2);
      // Thrusters
      ctx.fillRect(shipX - s*3, shipY + s*3, s*2, s*3);
      ctx.fillRect(shipX + s*1, shipY + s*3, s*2, s*3);
      // Engine Flicker
      if (Math.random() > 0.2) {
          ctx.fillRect(shipX - s*2, shipY + s*6, s*1, s*2);
          ctx.fillRect(shipX + s*1, shipY + s*6, s*1, s*2);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

return (
    // CHANGE THIS LINE:
    <div className="absolute inset-0 w-full h-full bg-black overflow-hidden z-0">
      
      {/* Full Screen Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full block"
      />

      {/* Subtle CRT Scanlines Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[length:100%_3px] bg-repeat-y bg-gradient-to-b from-white via-transparent to-white" style={{backgroundSize: '100% 4px'}} />
      
      <style>{`
        canvas {
            filter: blur(0.5px) contrast(1.1) brightness(1.1);
        }
      `}</style>
    </div>
  );
};

const BootSequence = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  const bootText = [
    "INITIALIZING KERNEL...",
    "LOADING MEMORY MODULES... OK",
    "MOUNTING VIRTUAL FILE SYSTEM...",
    "CHECKING GPU ACCELERATION... [ENABLED]",
    "ESTABLISHING SECURE CONNECTION...",
    "LOADING USER PROFILE: KANISHK_SONI",
    "SYSTEM READY."
  ];

  useEffect(() => {
    let delay = 0;
    bootText.forEach((line) => {
      delay += Math.random() * 500 + 200;
      setTimeout(() => {
        setLines((prev) => [...prev, line]);
        const terminal = document.getElementById("boot-terminal");
        if (terminal) terminal.scrollTop = terminal.scrollHeight;
      }, delay);
    });
    setTimeout(onComplete, delay + 1000);
  }, []);

=======
const Contactme = () => {
>>>>>>> parent of a9860d3 (Refactor Contact, Home, and Projects components for improved UX and functionality)
  return (
    <DotLottieReact
      src="https://lottie.host/b24a225a-48b3-4301-beba-5df87625820b/fwEWxL9vX1.lottie"
      loop
      className="size-[100px] "
      autoplay
    />
  );
};

<<<<<<< HEAD
const WindowFrame = ({ title, children, onClose, constraintsRef }) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleMaximize = (e) => {
    e.stopPropagation();
    setIsMaximized(!isMaximized);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    onClose(); // Acts as close/minimize to dock
  };

  return (
    <motion.div
      drag={!isMaximized} 
      dragConstraints={constraintsRef}
      dragMomentum={false}
      dragElastic={0.1}
      initial={{ scale: 0.8, opacity: 0, y: 50 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        y: isMaximized ? 0 : 0,
        x: isMaximized ? 0 : 0,
        width: isMaximized ? "100%" : "clamp(350px, 85vw, 1100px)", 
        height: isMaximized ? "100%" : "clamp(450px, 80vh, 800px)",
        borderRadius: isMaximized ? "0px" : "12px",
      }}
      exit={{ scale: 0.8, opacity: 0, y: 50, transition: { duration: 0.2 } }}
      className={`absolute z-50 flex flex-col bg-[#09090b]/90 backdrop-blur-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden ring-1 ring-white/5 ${isMaximized ? "inset-0" : ""}`}
    >
      <div 
        className="h-9 bg-gradient-to-r from-white/5 to-transparent border-b border-white/5 flex items-center justify-between px-3 select-none cursor-grab active:cursor-grabbing"
        onDoubleClick={toggleMaximize}
      >
        <div className="flex gap-2 items-center group">
          <div onClick={(e) => { e.stopPropagation(); onClose(); }} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer flex items-center justify-center text-[8px] font-bold text-transparent group-hover:text-black transition-all">×</div>
          <div onClick={handleMinimize} className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 cursor-pointer flex items-center justify-center text-[8px] font-bold text-transparent group-hover:text-black transition-all">-</div>
          <div onClick={toggleMaximize} className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 cursor-pointer flex items-center justify-center text-[6px] font-bold text-transparent group-hover:text-black transition-all">{isMaximized ? '↙' : '↗'}</div>
        </div>
        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
             <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
             {title}
        </div>
        <div className="w-10" />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/40 relative">
        {children}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_3px] z-50 opacity-20" />
      </div>
    </motion.div>
  );
};


const DesktopIcon = ({ label, onClick, children, delay, constraintsRef }) => {
  const grabSoundRef = useRef(new Audio(grabSoundUrl));
  const dropSoundRef = useRef(new Audio(dropSoundUrl));

  const playSound = (ref) => { try { ref.current.currentTime=0; ref.current.play(); } catch(e){} };

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragMomentum={false}
      onDragStart={() => playSound(grabSoundRef)}
      onDragEnd={() => playSound(dropSoundRef)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.2, duration: 0.5 }}
      whileHover={{ scale: 1.05, zIndex: 20 }}
      className="relative cursor-pointer group flex flex-col items-center gap-3 w-28 md:w-36"
      onClick={onClick}
    >
      <div className="w-full aspect-square bg-zinc-900/30 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg group-hover:border-green-500/50 group-hover:bg-zinc-800/50 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.2)] transition-all duration-300 relative">
        {children}
        <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="px-3 py-1 bg-black/60 border border-white/5 rounded-full backdrop-blur-md">
        <p className="text-[10px] md:text-xs font-mono text-zinc-300 uppercase tracking-wider group-hover:text-green-400 transition-colors">
            {label}
        </p>
      </div>
    </motion.div>
  );
};


=======
// Import sound effects
// Create these files in your assets folder or use placeholder URLs
const grabSoundUrl = "/sounds/grab.mp3"; // Soft click sound when grabbing
const dropSoundUrl = "/sounds/drop.mp3"; // Thud sound when dropping
>>>>>>> parent of a9860d3 (Refactor Contact, Home, and Projects components for improved UX and functionality)

const Computerview = () => {
  const constraintsRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [countdown, setCountdown] = useState("");
  const [minisizebuttonhovereffecttext, setminisizebuttonhovereffecttext] =
    useState(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="38"
        height="38"
        fill="black"
      >
        <path d="M5 11V13H19V11H5Z"></path>
      </svg>
    );
  // Add a new state to track if drag just ended
  const [justDragged, setJustDragged] = useState(false);

  const clicked = {
    one: searchParams.get("section") === "about",
    two: searchParams.get("section") === "clock",
    three: searchParams.get("section") === "projects",
    // four: searchParams.get("section") === "links",
    five: searchParams.get("section") === "contact",
  };

  // Add refs for sound effects
  const grabSoundRef = useRef(new Audio(grabSoundUrl));
  const dropSoundRef = useRef(new Audio(dropSoundUrl));

  // Add drag state tracking
  const [isDragging, setIsDragging] = useState(false);
  const [draggedComponent, setDraggedComponent] = useState(null);

  // Add drag starting position tracking
  const [draggingStartPos, setDraggingStartPos] = useState({ x: 0, y: 0 });

  // Preload sounds
  useEffect(() => {
    grabSoundRef.current.load();
    dropSoundRef.current.load();

    return () => {
      grabSoundRef.current.pause();
      dropSoundRef.current.pause();
    };
  }, []);

  // Play grab sound
  const playGrabSound = () => {
    try {
      grabSoundRef.current.currentTime = 0;
      grabSoundRef.current.play();
    } catch (err) {
      console.log("Error playing grab sound:", err);
    }
  };

  // Play drop sound
  const playDropSound = () => {
    try {
      dropSoundRef.current.currentTime = 0;
      dropSoundRef.current.play();
    } catch (err) {
      console.log("Error playing drop sound:", err);
    }
  };

  // Handle drag start with sound and position tracking
  const handleDragStart = (componentId, event) => {
    setIsDragging(true);
    setDraggedComponent(componentId);

    // Store the starting position
    if (event && event.clientX && event.clientY) {
      setDraggingStartPos({
        x: event.clientX,
        y: event.clientY,
      });
    }

    playGrabSound();
  };

  // Handle drag end with sound
  const handleDragEnd = (event) => {
    setIsDragging(false);
    playDropSound();
    setTimeout(() => setDraggedComponent(null), 100);

    // Set justDragged to true when drag ends
    setJustDragged(true);

    // Reset justDragged after a short delay
    setTimeout(() => {
      setJustDragged(false);
    }, 500); // Increased to 500ms for better reliability
  };

  // Custom click handler that checks if a real drag occurred
  const handleComponentClick = (componentId, event, clickHandler) => {
    // If we're dragging or just finished dragging, don't process click
    if (isDragging || justDragged) return;

    // If there was meaningful movement during drag, don't process as click
    if (draggingStartPos.x !== 0 && event && event.clientX) {
      const distanceMoved = Math.sqrt(
        Math.pow(event.clientX - draggingStartPos.x, 2) +
          Math.pow(event.clientY - draggingStartPos.y, 2)
      );

      // If moved more than 5px, consider it a drag not a click
      if (distanceMoved > 5) {
        setDraggingStartPos({ x: 0, y: 0 });
        return;
      }
    }

    // Reset starting position
    setDraggingStartPos({ x: 0, y: 0 });

    // Execute the click handler
    clickHandler();
  };

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

  const updateClickedOne = () => {
    if (justDragged) return; // Prevent click action if just finished dragging
    if (!clicked.one) {
      setSearchParams({ section: "about" });
    } else {
      setSearchParams({});
    }
  };

  const updateClickedtwo = () => {
    if (justDragged) return; // Prevent click action if just finished dragging
    if (!clicked.two) {
      setSearchParams({ section: "clock" });
    } else {
      setSearchParams({});
    }
  };

  const updateClickedthree = () => {
    if (justDragged) return; // Prevent click action if just finished dragging
    if (!clicked.three) {
      setSearchParams({ section: "projects" });
    } else {
      setSearchParams({});
    }
  };

  const updateClickedfour = () => {
    if (justDragged) return; // Prevent click action if just finished dragging
    if (!clicked.four) {
      setSearchParams({ section: "links" });
    } else {
      setSearchParams({});
    }
  };

  const updateClickedfive = () => {
    if (justDragged) return; // Prevent click action if just finished dragging
    if (!clicked.five) {
      setSearchParams({ section: "contact" });
    } else {
      setSearchParams({});
    }
  };

  const myskills = [
    "Express.js",
    "React",
    "Next.js",
    "GSAP",
    "mySQL",
    "PostgreSQL",
    "Javascript",
    "Java",
    "C++",
    "DSA",
    "Python",
    "tailwind",
    "typescript",
    "mongodb",
  ];

  const skillsComponents = myskills.map((item, index) => (
    <div
      key={index}
      className="bg-zinc-600/50 font-['Aquire'] p-4 max-md:p-1 backdrop-blur-sm flex justify-center items-center rounded-3xl max-md:w-[100px] max-md:h-[100px]   max-md:text-sm hover:bg-zinc-900/50 duration-300 text-xl font-semibold text-center w-[150px] h-[150px]"
    >
      {item}
    </div>
  ));

  useEffect(() => {
    function showTime() {
      const now = new Date();
      const options = { year: "numeric", month: "long", day: "numeric" };
      const formattedDate = now.toLocaleDateString(undefined, options);
      setCurrentTime(formattedDate);
    }

    function showCountdown() {
      const targetDate = new Date("2023-08-27");
      const now = new Date();
      const timeDifference = now - targetDate;
      const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
      setCountdown(`${daysRemaining}`);
    }

    function update() {
      showTime();
      showCountdown();
    }

    update();
    const intervalId = setInterval(update, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function ShowTime() {
    const [currentDateTime, setCurrentDateTime] = useState({
      day: "",
      date: "",
      time: "",
    });

    useEffect(() => {
      const updateCurrentDateTime = () => {
        const now = new Date();
        const options = { weekday: "long" };
        const day = now.toLocaleDateString(undefined, options).slice(0, 3);
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString().split(":").join(".");
        setCurrentDateTime({ day, date, time });
      };

      updateCurrentDateTime();
      const intervalId = setInterval(updateCurrentDateTime, 1000);

      return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);

    return (
      <div id="Time">
        <div className="text-6xl font-bold"> {currentDateTime.day}</div>
        <div className="text-6xl font-bold"> {currentDateTime.time}</div>
        min{" "}
      </div>
    );
  }

  const getmouseneterofminizebutton = () => {
    setminisizebuttonhovereffecttext("home");
  };

  const getmousexitrofminizebutton = () => {
    setminisizebuttonhovereffecttext(
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="38"
        height="38"
        fill="black"
      >
        <path d="M5 11V13H19V11H5Z"></path>
      </svg>
    );
  };

  const MacStyleCloseButton = ({ onClick, onMouseEnter, onMouseLeave }) => (
    <div
      className="mac-buttons-container absolute left-[2%] top-3 z-50"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      id="Close"
    >
      <div className="mac-close-button" title="close" onClick={onClick} />
      {/* <div className="mac-minimize-button" />
      <div className="mac-maximize-button" /> */}
    </div>
  );

  MacStyleCloseButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
  };

  return (
    <motion.div
      // ref={constraintsRef}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.6 },
      }}
      className={`${
        clicked.one || clicked.four || clicked.three || clicked.five
          ? "w-[98vw] h-full flex overflow-x-hidden justify-center items-center"
          : "w-[75vw] h-[75vh] items-start flex flex-wrap justify-start"
      } bg-zinc-900 relative overflow-hidden gap-2 rounded-2xl p-3 duration-500 `}
    >
      {/* About section with Mac-style close button */}
      <motion.div
        onClick={(e) =>
          !clicked.one && handleComponentClick("about", e, updateClickedOne)
        }
        drag={!clicked.one}
        dragConstraints={constraintsRef}
        onDragStart={(e) => handleDragStart("about", e)}
        onDragEnd={handleDragEnd}
        whileDrag={{
          scale: 1.02,
          boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.3)",
        }}
        className={`  duration-300  ${
          clicked.two || clicked.three || clicked.five
            ? "hidden"
            : "w-[70%] h-1/2"
        } ${
          clicked.one
            ? "w-[97.6vw] h-fit px-4 bg-zinc-500  "
            : "w-[70%] backdrop-blur-xl cursor-none h-1/2 overflow-hidden justify-start  gap-4 items-start"
        }  p-3    bg-zinc-800/50 rounded-xl ${
          draggedComponent === "about" ? "z-50" : ""
        }`}
      >
        {clicked.one ? (
          <div className="w-full max-md:min-h-[250vh] px-6 relative sm:px-24 min-h-[100vh] h-fit flex flex-col justify-start  items-center">
            <MacStyleCloseButton
              onClick={() => {
                getmousexitrofminizebutton();
                updateClickedOne();
              }}
              onMouseEnter={getmouseneterofminizebutton}
              onMouseLeave={getmousexitrofminizebutton}
            />
            <div className=" flex  w-full justify-center relative flex-col items-center ">
              <div className="flex justify-start min-h-[5vh] h-fit mt-4 items-center gap-4">
                <p className="text-5xl font-semibold font-['Aquire']">Hi</p>
                <picture>
                  <source
                    className="w-fit"
                    srcSet="https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.webp"
                    type="image/webp"
                  />
                  <img
                    src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.gif"
                    alt="👋"
                    width="32"
                    height="32"
                  />
                </picture>
              </div>
              <div className="min-h-fit p-3 md:text-xl  lg:text-3xl 2xl:text-3xl w-full h-fit sm:w-[70%] font-['Aquire'] text-center">
                My name is <span className="font-bold ">Kanishk Soni</span>. I
                live in Jaipur and I am {new Date().getFullYear() - 2005} years
                old. I have been coding for{" "}
                <span className="font-semibold">{countdown} days</span>. I have
                completed many projects, but some top projects are mentioned
                here. You can visit my GitHub to view all my projects. I hope
                you like my portfolio.
              </div>
            </div>
            <div className="flex mt-3 justify-center relative items-center w-[98vw] overflow-hidden    bg-transparent h-[30vh]  overflow-x-hidden">
              <Animation />
            </div>

            <div>
              <div className=" md:mt-[] w-[95.5w] mt-3 py-4  rounded-2xl flex relative justify- items-start bg-[#141414]  md:">
                <video
                  muted
                  autoPlay
                  loop
                  src={housewithfishvideo}
                  preload="none" // Lazy load video
                  className="w-[30vw] object-cover h-[25vw]"
                ></video>
                <div className="text-7xl w-full z-20 top-[17%] h-fit flex justify-center items-center absolute  ">
                  <h1
                    style={{ textShadow: "0px 0px 3px #ffffff" }}
                    className="font-['monument']"
                  >
                    MY know tech
                  </h1>
                </div>
                <div className="flex flex-wrap gap-3 z-20 pt-[10%] bg-transparent w-[97vw] h-[75%] justify-center items-center px-[10vw]">
                  {skillsComponents}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="about"
            className="duration-300 w-full h-full flex cursor-none justify-start p-3 gap-4 items-start bg-transparent backdrop-blur-xl rounded-xl"
          >
            <div className="rounded-2xl  overflow-hidden w-[25%] h-full">
              <PixelTransition
                firstContent={
                  <img
                    src={mypic}
                    alt="default pixel transition content, a cat!"
                    loading="lazy" // Lazy load image
                    className="w-full duration-200 h-full object-cover "
                  />
                }
                secondContent={
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      backgroundColor: "#111",
                    }}
                  >
                    <p
                      style={{
                        fontWeight: 900,
                        fontSize: "2rem",
                        color: "#ffffff",
                      }}
                    >
                      Click Me !
                    </p>
                  </div>
                }
                gridSize={12}
                pixelColor="#ffffff"
                animationStepDuration={0.4}
                className="custom-pixel-card"
              />
            </div>
            <div className="w-[60%] h-full flex justify-start items-center flex-col">
              <h1 className="font-bold font-['monument'] bg-clip-text  text-3xl text-transparent bg-gradient-to-l from-red-500 to-purple-700">
                I&apos;m Kanishk
              </h1>
              <p className="md:text-[13px] lg:text-[1vw] text-center">
                <>
                  <p>
                    Hey there! I&apos;m{" "}
                    <span className="font-bold ">Kanishk Soni</span>, an{" "}
                    {new Date().getFullYear() - 2005}-year-old coding enthusiast
                    hailing from the vibrant city of Jaipur. Coding has been my
                    passion for{" "}
                    <span className="font-semibold">{countdown} days</span>, and
                    in that time, I&apos;ve brought several exciting projects to
                    life. While I&apos;ve completed many, I&apos;ve highlighted
                    a few of my favorites here. Curious to see more? Dive into
                    my GitHub to explore the full spectrum of my work. I hope
                    you enjoy browsing through my portfolio as much as I enjoyed
                    creating it!
                  </p>
                </>
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Clock section with Mac-style close button */}
      <motion.div
        onClick={(e) =>
          !clicked.two && handleComponentClick("clock", e, updateClickedtwo)
        }
        drag={!clicked.two}
        dragConstraints={constraintsRef}
        onDragStart={(e) => handleDragStart("clock", e)}
        onDragEnd={handleDragEnd}
        whileDrag={{
          scale: 1.02,
          boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.3)",
          // Visual effect for dragging
          zIndex: 50,
        }}
        className={`bg-zinc-800/50 flex cursor-none duration-300 backdrop-blur-2xl justify-center items-center p-3 rounded-xl ${
          clicked.one || clicked.three || clicked.five
            ? "hidden"
            : "w-[29%] h-1/2"
        } ${clicked.two ? "w-[97.6vw] h-full" : "w-[29%] h-1/2"} ${
          draggedComponent === "clock" ? "z-50" : ""
        }`}
      >
        {clicked.two ? (
          <div className="w-full min-h-full gap-1  flex justify-start items-center  h-full rounded-xl ">
            <MacStyleCloseButton
              onClick={() => updateClickedtwo()}
              onMouseEnter={getmouseneterofminizebutton}
              onMouseLeave={getmousexitrofminizebutton}
            />
            <Suspense fallback={<div className="text-xl p-8">Loading...</div>}>
              <Clock />
            </Suspense>
          </div>
        ) : (
          <ShowTime />
        )}
      </motion.div>
      <motion.div
        onClick={(e) =>
          !clicked.three &&
          handleComponentClick("projects", e, updateClickedthree)
        }
        drag={!clicked.three}
        dragConstraints={constraintsRef}
        onDragStart={(e) => handleDragStart("projects", e)}
        onDragEnd={handleDragEnd}
        whileDrag={{
          scale: 1.02,
          boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.3)",
        }}
        className={`  ${
          clicked.two || clicked.one || clicked.five
            ? "hidden"
            : "w-[30%] h-1/2"
        }
  ${
    clicked.three
      ? "w-[97.6vw] pt-10 min-h-screen  h-full bg-zinc-800"
      : "w-[30%] h-1/2 cursor-none"
  }
     backdrop-blur-2xl relative overflow-hidden  rounded-xl ${
       draggedComponent === "projects" ? "z-50" : ""
     }`}
      >
        {/* the video is not playing because of ^ upper div */}
        {clicked.three ? (
          <div className="w-full h-fit flex flex-col justify-between items-start  min-h-screen ">
            <MacStyleCloseButton
              onClick={() => updateClickedthree()}
              onMouseEnter={getmouseneterofminizebutton}
              onMouseLeave={getmousexitrofminizebutton}
            />
            <Suspense fallback={<div className="text-xl p-8">Loading...</div>}>
              <Projects />
            </Suspense>
          </div>
        ) : (
          <div id="Projects">
            <video
              src={video}
              className="w-full h-full object-cover "
              autoPlay
              muted
              loop
              preload="none" // Lazy load video
            ></video>
            <div className=" -top-[0%]  rounded-xl flex justify-center items-center  w-full h-full bg-black absolute mix-blend-multiply selection:bg-black  text-3xl ">
              <div className="flex justify-center items-center text-7xl font-extrabold ">
                Projects
              </div>
            </div>
          </div>
        )}
      </motion.div>
      <motion.div
        onClick={(e) =>
          !clicked.four && handleComponentClick("links", e, updateClickedfour)
        }
        drag={!clicked.four}
        dragConstraints={constraintsRef}
        onDragStart={(e) => handleDragStart("links", e)}
        onDragEnd={handleDragEnd}
        whileDrag={{
          scale: 1.02,
          boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.3)",
        }}
        className={`  ${
          clicked.two ||
          clicked.one ||
          clicked.four ||
          clicked.three ||
          clicked.five
            ? "hidden"
            : "w-[30%] h-1/2"
        } bg-zinc-900/50  backdrop-blur-2xl flex flex-wrap rounded-xl ${
          draggedComponent === "links" ? "z-50" : ""
        }`}
        id="Links"
      >
        <div className="flex h-1/2 w-1/2 justify-center items-center">
          <p className="text-5xl  gap-2 font-bold  ">
            LIN
            <br />
            KS{" "}
          </p>
          <span className="text-9xl  -mt-10 ">:</span>
        </div>
        <div className="w-1/2 h-1/2 cursor-none ">
          <a
            target="Black_"
            href="https://www.linkedin.com/in/kanishk-soni-8047a2272/"
            className="cursor-none"
            id="linkedin-link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="100%"
              height="100%"
              fill="currentColor"
            >
              <path d="M18.3362 18.339H15.6707V14.1622C15.6707 13.1662 15.6505 11.8845 14.2817 11.8845C12.892 11.8845 12.6797 12.9683 12.6797 14.0887V18.339H10.0142V9.75H12.5747V10.9207H12.6092C12.967 10.2457 13.837 9.53325 15.1367 9.53325C17.8375 9.53325 18.337 11.3108 18.337 13.6245V18.339H18.3362ZM7.00373 8.57475C6.14573 8.57475 5.45648 7.88025 5.45648 7.026C5.45648 6.1725 6.14648 5.47875 7.00373 5.47875C7.85873 5.47875 8.55173 6.1725 8.55173 7.026C8.55173 7.88025 7.85798 8.57475 7.00373 8.57475ZM8.34023 18.339H5.66723V9.75H8.34023V18.339ZM19.6697 3H4.32923C3.59498 3 3.00098 3.5805 3.00098 4.29675V19.7033C3.00098 20.4202 3.59498 21 4.32923 21H19.6675C20.401 21 21.001 20.4202 21.001 19.7033V4.29675C21.001 3.5805 20.401 3 19.6675 3H19.6697Z"></path>
            </svg>
          </a>
        </div>
        <div className="w-1/2 h-1/2 cursor-none ">
          <a
            target="Black_"
            href="https://www.instagram.com/kanishk____soni/"
            className="cursor-none"
            id="instagram-link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M13.0281 2.00073C14.1535 2.00259 14.7238 2.00855 15.2166 2.02322L15.4107 2.02956C15.6349 2.03753 15.8561 2.04753 16.1228 2.06003C17.1869 2.1092 17.9128 2.27753 18.5503 2.52503C19.2094 2.7792 19.7661 3.12253 20.3219 3.67837C20.8769 4.2342 21.2203 4.79253 21.4753 5.45003C21.7219 6.0867 21.8903 6.81337 21.9403 7.87753C21.9522 8.1442 21.9618 8.3654 21.9697 8.58964L21.976 8.78373C21.9906 9.27647 21.9973 9.84686 21.9994 10.9723L22.0002 11.7179C22.0003 11.809 22.0003 11.903 22.0003 12L22.0002 12.2821L21.9996 13.0278C21.9977 14.1532 21.9918 14.7236 21.9771 15.2163L21.9707 15.4104C21.9628 15.6347 21.9528 15.8559 21.9403 16.1225C21.8911 17.1867 21.7219 17.9125 21.4753 18.55C21.2211 19.2092 20.8769 19.7659 20.3219 20.3217C19.7661 20.8767 19.2069 21.22 18.5503 21.475C17.9128 21.7217 17.1869 21.89 16.1228 21.94C15.8561 21.9519 15.6349 21.9616 15.4107 21.9694L15.2166 21.9757C14.7238 21.9904 14.1535 21.997 13.0281 21.9992L12.2824 22C12.1913 22 12.0973 22 12.0003 22L11.7182 22L10.9725 21.9993C9.8471 21.9975 9.27672 21.9915 8.78397 21.9768L8.58989 21.9705C8.36564 21.9625 8.14444 21.9525 7.87778 21.94C6.81361 21.8909 6.08861 21.7217 5.45028 21.475C4.79194 21.2209 4.23444 20.8767 3.67861 20.3217C3.12278 19.7659 2.78028 19.2067 2.52528 18.55C2.27778 17.9125 2.11028 17.1867 2.06028 16.1225C2.0484 15.8559 2.03871 15.6347 2.03086 15.4104L2.02457 15.2163C2.00994 14.7236 2.00327 14.1532 2.00111 13.0278L2.00098 10.9723C2.00284 9.84686 2.00879 9.27647 2.02346 8.78373L2.02981 8.58964C2.03778 8.3654 2.04778 8.1442 2.06028 7.87753C2.10944 6.81253 2.27778 6.08753 2.52528 5.45003C2.77944 4.7917 3.12278 4.2342 3.67861 3.67837C4.23444 3.12253 4.79278 2.78003 5.45028 2.52503C6.08778 2.27753 6.81278 2.11003 7.87778 2.06003C8.14444 2.04816 8.36564 2.03847 8.58989 2.03062L8.78397 2.02433C9.27672 2.00969 9.8471 2.00302 10.9725 2.00086L13.0281 2.00073ZM12.0003 7.00003C9.23738 7.00003 7.00028 9.23956 7.00028 12C7.00028 14.7629 9.23981 17 12.0003 17C14.7632 17 17.0003 14.7605 17.0003 12C17.0003 9.23713 14.7607 7.00003 12.0003 7.00003ZM12.0003 9.00003C13.6572 9.00003 15.0003 10.3427 15.0003 12C15.0003 13.6569 13.6576 15 12.0003 15C10.3434 15 9.00028 13.6574 9.00028 12C9.00028 10.3431 10.3429 9.00003 12.0003 9.00003ZM17.2503 5.50003C16.561 5.50003 16.0003 6.05994 16.0003 6.74918C16.0003 7.43843 16.5602 7.9992 17.2503 7.9992C17.9395 7.9992 18.5003 7.4393 18.5003 6.74918C18.5003 6.05994 17.9386 5.49917 17.2503 5.50003Z"></path>
            </svg>
          </a>
        </div>
        <div className="w-1/2 h-1/2  cursor-none">
          <a
            target="Black_"
            href="https://github.com/kanishk1122"
            className="cursor-none"
            id="github-link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"></path>
            </svg>
          </a>
        </div>
      </motion.div>
      <motion.div
        onClick={(e) =>
          !clicked.five && handleComponentClick("contact", e, updateClickedfive)
        }
        drag={!clicked.five}
        dragConstraints={constraintsRef}
        onDragStart={(e) => handleDragStart("contact", e)}
        onDragEnd={handleDragEnd}
        whileDrag={{
          scale: 1.02,
          boxShadow: "0px 0px 8px rgba(255, 255, 255, 0.3)",
        }}
        className={`w-[38%] h-1/2  ${
          !clicked.five
            ? clicked.two || clicked.one || clicked.four || clicked.three
              ? "hidden"
              : "w-[38%] h-1/2 "
            : "w-[96vw]  h-full flex overflow-x-hidden  justify-center items-center"
        } 
  ${
    clicked.five
      ? "w-[96vw]  h-full flex overflow-x-hidden  justify-center items-center"
      : " w-[38%] h-1/2 "
  }
   bg-zinc-800/50  backdrop-blur-2xl flex justify-center items-center px-6 p-3 flex-col rounded-xl ${
     draggedComponent === "contact" ? "z-50" : ""
   }`}
      >
        {clicked.five ? (
          <div className="w-full h-full ">
            <MacStyleCloseButton
              onClick={() => updateClickedfive()}
              onMouseEnter={getmouseneterofminizebutton}
              onMouseLeave={getmousexitrofminizebutton}
            />
            <Suspense fallback={<div className="text-xl p-8">Loading...</div>}>
              <Contact />
            </Suspense>
          </div>
        ) : (
          <div
            className="text-7xl flex justify-start items-center cursor-none w-full h-full "
            id="Contact"
          >
            Contact <br /> ME
            {/* <Contactme /> */}
          </div>
        )}
      </motion.div>

      {/* Help tooltip that appears when a component is being dragged */}
      {isDragging && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full z-[100] text-sm">
          Drag to reposition • Click to expand
        </div>
      )}
    </motion.div>
  );
};

export default Computerview;
