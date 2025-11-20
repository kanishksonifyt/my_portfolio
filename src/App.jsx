import React, { useEffect, useRef } from "react";
// Custom Cursor Component
function ElasticCursor() {
  const dotRef = useRef(null);
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const target = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const raf = useRef();
  const [hoveredId, setHoveredId] = React.useState("");
  const [isOverDiv, setIsOverDiv] = React.useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      // Find the topmost parent div with an id (not a nested child div)
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
          // Only use this if its parent is not a div with an id
          if (
            !el.parentElement ||
            el.parentElement.tagName !== "DIV" ||
            !el.parentElement.id
          ) {
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
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.2;
      pos.current.y += (target.current.y - pos.current.y) * 0.2;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${
          pos.current.x - 16
        }px, ${pos.current.y - 16}px, 0)`;
      }
      raf.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const [isOverInput, setIsOverInput] = React.useState(false);
  const isClose = hoveredId === "Close";
  let cursorWidth = 32;
  if (isOverInput) cursorWidth = 8;
  else if (isOverDiv) cursorWidth = 80;
  return (
    <div
      ref={dotRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: cursorWidth,
        height: 32,
        borderRadius: 16,
        background: isClose ? "#e3342f" : "#fff",
        pointerEvents: "none",
        zIndex: 9999,
        boxShadow: isClose
          ? "0 0 12px 4px rgba(227,52,47,0.4)"
          : "0 0 8px 2px rgba(255,255,255,0.3)",
        transition: "width 0.2s, background 0.2s, box-shadow 0.2s",
        mixBlendMode: "difference",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        color: isClose ? "#fff" : "#000",
        fontWeight: 700,
        userSelect: "none",
      }}
    >
  


      {isOverDiv &&
        hoveredId &&
        hoveredId !== "root" &&
        (isClose ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: "block" }}
          >
            <line
              x1="5"
              y1="5"
              x2="15"
              y2="15"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="15"
              y1="5"
              x2="5"
              y2="15"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <span
            style={{ pointerEvents: "none", color: "#000", fontWeight: 700 }}
          >
            {hoveredId}
          </span>
        ))}
    </div>
  );
}
// import React from "react"; // Removed duplicate import
import Routing from "./utils/Routing";
import ClickSpark from "./utils/Clickeffect.jsx";

const App = () => {
  return (
    <ClickSpark
      sparkColor="#fff"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <ElasticCursor />
      <div className="main w-full h-fit bg-black text-white">
        <Routing />
      </div>
    </ClickSpark>
  );
};

// Wrap the main App with the custom cursor
export default App;
