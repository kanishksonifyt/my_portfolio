import React, { useEffect, useRef, useState } from "react";
import Routing from "./utils/Routing";
import ClickSpark from "./utils/Clickeffect.jsx";

function ElasticCursor() {
  const dotRef = useRef(null);
  
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const vel = useRef({ x: 0, y: 0 });
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const rotation = useRef(0);
  
  const raf = useRef();
  const [hoveredId, setHoveredId] = useState("");
  const [isOverDiv, setIsOverDiv] = useState(false);
  const [isOverInput, setIsOverInput] = useState(false);
  const [isClicking, setIsClicking] = useState(false); // New State for Click

  useEffect(() => {
    const handleMouseMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;

      // --- Element Detection ---
      let el = document.elementFromPoint(e.clientX, e.clientY);
      let foundId = "";
      let foundDiv = false;
      let isInput = false;
      let tempEl = el;

      while (tempEl) {
        if (tempEl.tagName === "INPUT" || tempEl.tagName === "TEXTAREA") {
          isInput = true;
          break;
        }
        tempEl = tempEl.parentElement;
      }

      while (el) {
        if (el.tagName === "DIV" && el.id) {
          foundId = el.id;
          foundDiv = true;
          if (!el.parentElement || el.parentElement.tagName !== "DIV" || !el.parentElement.id) {
            break;
          }
        }
        el = el.parentElement;
      }

      if (foundDiv && foundId) {
        setHoveredId(foundId);
        setIsOverDiv(!isInput && foundId !== "root");
      } else {
        setHoveredId("");
        setIsOverDiv(false);
      }
      setIsOverInput(isInput);
    };

    // --- Click Listeners ---
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // --- ANIMATION LOOP ---
    const animate = () => {
      const lerpFactor = 0.15; 

      // 1. Calculate Position (Lerp)
      const nextX = pos.current.x + (target.current.x - pos.current.x) * lerpFactor;
      const nextY = pos.current.y + (target.current.y - pos.current.y) * lerpFactor;

      // Calculate Velocity
      vel.current.x = nextX - pos.current.x;
      vel.current.y = nextY - pos.current.y;

      pos.current.x = nextX;
      pos.current.y = nextY;

      // 2. Speed & Rotation
      const speed = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2);
      if (speed > 0.1) {
        rotation.current = Math.atan2(vel.current.y, vel.current.x) * (180 / Math.PI);
      }

      // 3. Stretch Logic
      const stretchFactor = Math.min(speed * 0.05, 0.5); 
      let scaleX = 1 + stretchFactor;
      let scaleY = 1 - stretchFactor * 0.4;

      // 4. Click Response (Squash effect)
      // If clicking, we override the stretch slightly to mimic pressure
      if (isClicking) {
        scaleX *= 0.8; // Shrink width
        scaleY *= 0.8; // Shrink height
      }

      // 5. Apply Transform
      if (dotRef.current) {
        dotRef.current.style.transform = `
          translate3d(${pos.current.x - 16}px, ${pos.current.y - 16}px, 0)
          rotate(${rotation.current}deg)
          scale(${scaleX}, ${scaleY})
        `;
      }
      
      raf.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(raf.current);
    };
  }, [isClicking]); // Re-bind if isClicking changes isn't strictly necessary for the loop but good for listeners if they depended on it

  const isClose = hoveredId === "Close";
  
  let cursorWidth = 32;
  if (isOverInput) cursorWidth = 8;
  else if (isOverDiv) cursorWidth = 80;

  const centeringOffset = (cursorWidth - 32) / 2;

  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: cursorWidth,
        height: 32,
        marginLeft: isOverDiv ? -centeringOffset : 0, 
        borderRadius: 20,
        background: isClose ? "#e3342f" : "#fff",
        pointerEvents: "none",
        zIndex: 9999,
        // Add scaling to the boxShadow so it pulses when clicked
        boxShadow: isClicking 
            ? "0 0 20px 5px rgba(255, 255, 255, 0.5)" 
            : isClose
                ? "0 0 12px 4px rgba(227,52,47,0.4)"
                : "0 0 8px 2px rgba(255,255,255,0.3)",
        transition: "margin-left 0.3s ease, background 0.2s, width 0.3s ease, box-shadow 0.1s ease",
        mixBlendMode: "difference",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        color: isClose ? "#fff" : "#000",
        fontWeight: 700,
        userSelect: "none",
        willChange: "transform",
      }}
    >
      {isOverDiv && hoveredId && hoveredId !== "root" && (
        <div style={{ transform: `scale(${1 / (1 + 0)})` }}>
            {isClose ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: "block" }}>
                <line x1="5" y1="5" x2="15" y2="15" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <line x1="15" y1="5" x2="5" y2="15" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            </svg>
            ) : (
            <span style={{ pointerEvents: "none", color: "#000", fontWeight: 700 }}>
                {hoveredId}
            </span>
            )}
        </div>
      )}
    </div>
  );
}

const App = () => {
  return (
    <ClickSpark sparkColor="#fff" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
      <ElasticCursor />
      <div className="main w-full h-fit bg-black text-white">
        <Routing />
      </div>
    </ClickSpark>
  );
};

export default App;