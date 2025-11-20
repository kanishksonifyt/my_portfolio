/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// --- ASSETS (Ensure these paths are correct for your project) ---
import mypic from "../public/images/Untitled-transformed.jpeg";
import video from "/videos/workportfilio.mp4";
import housewithfishvideo from "../assets/original.mp4";

// --- INTERNAL UTILS ---
import PixelTransition from "./utils/Pixelimage";
import Animation from "./Animationtest";

// --- LAZY IMPORTS ---
const Clock = lazy(() => import("./Clock"));
const Projects = lazy(() => import("./Projects"));
const Contact = lazy(() => import("./Contact"));

gsap.registerPlugin(ScrollTrigger);

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

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center font-mono text-green-500 p-10"
    >
      <div id="boot-terminal" className="w-full max-w-2xl h-64 overflow-hidden flex flex-col justify-end border-l-2 border-green-500/30 pl-4">
        {lines.map((line, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm md:text-base tracking-wider"
          >
            <span className="text-zinc-500">[{new Date().toLocaleTimeString()}]</span> {line}
          </motion.div>
        ))}
        <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="w-3 h-5 bg-green-500 mt-1"
        />
      </div>
      <div className="w-64 h-1 bg-zinc-900 mt-8 rounded overflow-hidden relative">
        <motion.div 
          className="absolute inset-y-0 left-0 bg-green-500 shadow-[0_0_10px_#22c55e]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

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



const Computerview = () => {
  const constraintsRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTime, setCurrentTime] = useState("");
  const [countdown, setCountdown] = useState("");
  const [booted, setBooted] = useState(false); 

  const activeSection = searchParams.get("section");
  const handleClose = () => setSearchParams({});
  const handleOpen = (section) => setSearchParams({ section });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour12: false }));
      setCountdown(Math.ceil((now - new Date("2023-08-27")) / (1000 * 60 * 60 * 24)));
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  const skills = [ "Express.js", "React", "Next.js", "GSAP", "mySQL", "PostgreSQL", "Javascript", "Java", "C++", "DSA", "Python", "Tailwind", "TypeScript", "MongoDB" , "AWS" ,"FLASK" ,"KAFKA" ];

  return (
    <>
      {/* --- BOOT SCREEN --- */}
      <AnimatePresence>
        {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      {/* --- MAIN OS INTERFACE --- */}
      <div className="w-full h-screen bg-black relative overflow-hidden flex items-center justify-center text-white selection:bg-green-500/30">
          
          {/* 1. ANIMATED BACKGROUND */}
          <BG />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black opacity-80 pointer-events-none" />

          {/* 2. DESKTOP AREA */}
          <motion.div ref={constraintsRef} className="w-[95vw] h-[85vh] relative z-10">
              
              {/* ICONS GRID */}
              <div className="absolute inset-0 flex flex-wrap content-start gap-6 p-4 md:p-10 pointer-events-auto">
                  
                  {/* ABOUT */}
                  <DesktopIcon label="Identity" delay={1} constraintsRef={constraintsRef} onClick={() => handleOpen("about")}>
                      <PixelTransition 
                          firstContent={<img src={mypic} className="w-full h-full object-cover opacity-90 grayscale group-hover:grayscale-0 transition-all" alt="Me"/>} 
                          secondContent={<div className="font-black text-xl">ID CARD</div>} 
                      />
                  </DesktopIcon>

                  {/* PROJECTS */}
                  <DesktopIcon label="Projects" delay={2} constraintsRef={constraintsRef} onClick={() => handleOpen("projects")}>
                       <video src={video} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" autoPlay muted loop />
                       <div className="absolute inset-0 flex items-center justify-center font-['monument'] text-xl drop-shadow-lg">WORK</div>
                  </DesktopIcon>

                  {/* CLOCK */}
                  <DesktopIcon label="System_Time" delay={3} constraintsRef={constraintsRef} onClick={() => handleOpen("clock")}>
                       <div className="font-mono text-sm">{currentTime}</div>
                  </DesktopIcon>

                  {/* CONTACT */}
                  <DesktopIcon label="Comms" delay={4} constraintsRef={constraintsRef} onClick={() => handleOpen("contact")}>
                       <div className="text-3xl">✉️</div>
                  </DesktopIcon>

                  {/* LINKS */}
                  <DesktopIcon label="Network" delay={5} constraintsRef={constraintsRef} onClick={() => handleOpen("links")}>
                       <div className="text-3xl">🌐</div>
                  </DesktopIcon>
              </div>

              {/* ACTIVE WINDOWS */}
              <AnimatePresence>
                  
                  {/* --- ABOUT WINDOW --- */}
                  {activeSection === "about" && (
                      <WindowFrame title="USER_PROFILE // IDENTITY.SYS" onClose={handleClose} constraintsRef={constraintsRef}>
                          <div className="w-full min-h-full flex flex-col items-center pt-8 pb-20 text-white">
                              <div className="flex items-center gap-4 mb-6">
                                  <h1 className="text-4xl md:text-6xl font-bold font-['Aquire']">KANISHK</h1>
                                  <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/512.gif" alt="👋" width="50" />
                              </div>
                              <div className="max-w-2xl text-center px-6 font-mono text-zinc-400 leading-relaxed mb-8 text-sm md:text-base">
                                  <p>Full Stack Developer based in <span className="text-green-400">Jaipur</span>.</p>
                                  <p>System Runtime: <span className="text-green-400">{countdown} days</span></p>
                              </div>
                              <div className="w-full h-[250px] mb-8 relative overflow-hidden border-y border-white/5 bg-black/40">
                                  <Animation />
                              </div>
                              <div className="w-[90%] bg-[#0a0a0a] rounded-xl border border-white/10 p-6 relative overflow-hidden group">
                                   <video muted autoPlay loop src={housewithfishvideo} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity" />
                                   <div className="relative z-10 flex flex-wrap justify-center gap-3">
                                      {skills.map((s, i) => (
                                          <span key={i} className="bg-black/60 border border-green-500/30 px-3 py-1 rounded text-xs font-mono text-green-400">{s}</span>
                                      ))}
                                   </div>
                              </div>
                          </div>
                      </WindowFrame>
                  )}

                  {/* --- PROJECTS WINDOW --- */}
                  {activeSection === "projects" && (
                      <WindowFrame title="PROJECT_REPOSITORY // READ_ONLY" onClose={handleClose} constraintsRef={constraintsRef}>
                          <Suspense fallback={<div className="p-10 text-center font-mono text-green-500 animate-pulse">LOADING DATA STREAMS...</div>}>
                              <Projects />
                          </Suspense>
                      </WindowFrame>
                  )}

                  {/* --- CLOCK WINDOW --- */}
                  {activeSection === "clock" && (
                      <WindowFrame title="TEMPORAL_MONITOR" onClose={handleClose} constraintsRef={constraintsRef}>
                           <div className="w-full h-full flex items-center justify-center">
                              <Suspense fallback={<div>Loading...</div>}><Clock /></Suspense>
                           </div>
                      </WindowFrame>
                  )}

                  {/* --- CONTACT WINDOW --- */}
                  {activeSection === "contact" && (
                      <WindowFrame title="SECURE_UPLINK_V2" onClose={handleClose} constraintsRef={constraintsRef}>
                           <div className="w-full h-full flex items-center justify-center">
                              <Suspense fallback={<div>Loading...</div>}><Contact /></Suspense>
                           </div>
                      </WindowFrame>
                  )}

                  {/* --- LINKS WINDOW --- */}
                  {activeSection === "links" && (
                      <WindowFrame title="EXTERNAL_NETWORKS" onClose={handleClose} constraintsRef={constraintsRef}>
                           <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                                {['GITHUB', 'LINKEDIN', 'INSTAGRAM'].map(link => (
                                    <a key={link} href="#" className="text-2xl font-['monument'] text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 hover:to-green-400 transition-all">
                                        {link}
                                    </a>
                                ))}
                           </div>
                      </WindowFrame>
                  )}

              </AnimatePresence>
          </motion.div>

          {/* 3. SYSTEM TRAY */}
          <div className="absolute bottom-6 px-6 py-3 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-full flex items-center gap-6 z-50 shadow-2xl">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                  <span className="text-[10px] font-mono text-green-400 uppercase tracking-widest">Online</span>
               </div>
               <div className="h-4 w-[1px] bg-white/10"></div>
               <div className="text-xs font-mono text-zinc-400">{currentTime}</div>
          </div>

      </div>
    </>
  );
};

export default Computerview;