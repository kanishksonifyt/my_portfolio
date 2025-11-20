import { useState, useEffect, useRef } from "react";
import allprojectdata from "../assets/allprojectdata.json";
import "../css/project.css"; // Ensure you keep your CSS if it has specific animations

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);

  // --- LOGIC: Fullscreen Handling ---
  useEffect(() => {
    if (fullscreenVideo) {
      document.body.style.overflow = "hidden";
      sessionStorage.setItem("fullscreenVideoActive", "true");
      // Auto-focus overlay
      setTimeout(() => {
        if (overlayRef.current) {
          overlayRef.current.scrollIntoView({ block: "center", inline: "center" });
        }
      }, 0);
    } else {
      document.body.style.overflow = "";
      sessionStorage.removeItem("fullscreenVideoActive");
    }
    return () => {
      document.body.style.overflow = "";
      sessionStorage.removeItem("fullscreenVideoActive");
    };
  }, [fullscreenVideo]);

  // Close on Escape
  useEffect(() => {
    if (!fullscreenVideo) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setFullscreenVideo(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenVideo]);

  // --- RENDER ---
  return (
    <div className="w-full min-h-full flex flex-col justify-start py-4 px-2 items-center text-white">
      
      {/* --- FULLSCREEN OVERLAY (Cinema Mode) --- */}
      {fullscreenVideo && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl"
          onClick={() => setFullscreenVideo(null)}
        >
          <div
            ref={videoContainerRef}
            className="relative w-[95vw] h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Close Bar */}
            <div className="absolute top-4 right-4 flex gap-4 z-50">
               <button
                onClick={() => {
                   if (videoRef.current) videoRef.current.requestFullscreen();
                }}
                className="px-4 py-2 bg-zinc-800/80 border border-white/10 rounded-full text-xs font-mono uppercase hover:bg-white hover:text-black transition-all"
              >
                [ ] Expand
              </button>
              <button
                className="w-10 h-10 flex items-center justify-center bg-red-500/20 border border-red-500/50 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all"
                onClick={() => setFullscreenVideo(null)}
              >
                ✕
              </button>
            </div>

            {/* Main Video */}
            <video
              ref={videoRef}
              src={fullscreenVideo}
              controls
              autoPlay
              loop
              className="w-full h-full object-contain rounded-lg shadow-2xl border border-zinc-800"
            />
          </div>
        </div>
      )}

      {/* --- PROJECT LIST --- */}
      {/* If a video is selected, we only show that one (Focus Mode) */}
      {fullscreenVideo ? (
        (() => {
          const item = allprojectdata.find((i) => i.video_link === fullscreenVideo);
          if (!item) return null;
          
          return (
            <div className="w-full h-full flex flex-col items-center justify-center p-10">
                 <h2 className="text-4xl md:text-6xl font-['monument'] text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500 mb-4 text-center">
                    {item.project_name}
                 </h2>
                 <p className="font-mono text-green-400 mb-8 animate-pulse">:: PLAYING PREVIEW ::</p>
                 <button 
                    onClick={() => setFullscreenVideo(null)}
                    className="px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all font-mono text-xs"
                 >
                    RETURN TO ARCHIVE
                 </button>
            </div>
          );
        })()
      ) : (
        // --- STANDARD LIST VIEW ---
        <div className="flex flex-col gap-12 w-full max-w-6xl pb-20">
          {allprojectdata.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
              onClick={() => setHoveredProject(index)} // Better mobile support
              className="group relative w-full bg-zinc-900/40 border border-white/5 rounded-3xl p-6 md:p-10 flex flex-wrap md:flex-nowrap gap-8 items-center transition-all hover:bg-zinc-900/60 hover:border-white/10 hover:shadow-2xl"
            >
              {/* LEFT: Info & Video Preview */}
              <div className="w-full md:w-1/2 flex flex-col gap-4 relative">
                
                {/* Floating Video Preview (Appears on Hover) */}
                <div
                  className={`absolute -top-24 left-0 w-[280px] h-[160px] rounded-xl overflow-hidden border-2 border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)] z-20 bg-black transition-all duration-300 ${
                    hoveredProject === index ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <video
                    src={item.video_link}
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2">
                     <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFullscreenVideo(item.video_link);
                        }}
                        className="bg-black/80 text-white text-[10px] font-mono px-2 py-1 rounded hover:bg-green-500 hover:text-black transition-colors"
                      >
                        FULLSCREEN
                      </button>
                  </div>
                </div>

                {/* Title & Links */}
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <h2 className="text-3xl md:text-5xl font-['monument'] text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 transition-all">
                    {item.project_name}
                  </h2>
                  {item.project_link !== "NO_LINK" && (
                    <a
                      href={item.project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path>
                      </svg>
                    </a>
                  )}
                </div>

                <p className="text-sm md:text-lg text-zinc-400 font-mono leading-relaxed">
                  {item.project_description}
                </p>
                
                <div className="flex gap-2 mt-2">
                     <span className="text-[10px] px-2 py-1 rounded border border-white/10 text-zinc-500 uppercase bg-black/20">React</span>
                     <span className="text-[10px] px-2 py-1 rounded border border-white/10 text-zinc-500 uppercase bg-black/20">GSAP</span>
                </div>
              </div>

              {/* RIGHT: Screenshots */}
              <div className="w-full md:w-1/2 h-[250px] md:h-[300px] relative group-hover:scale-[1.02] transition-transform duration-500">
                {/* Main Image */}
                <img
                  src={item.photo_links[0]}
                  loading="lazy"
                  alt={item.project_name}
                  className="w-full h-full object-cover rounded-2xl border border-white/10 shadow-lg z-10 relative"
                />
                
                {/* Secondary Image (Floating) */}
                <img
                  src={item.photo_links[1]}
                  loading="lazy"
                  alt="preview"
                  className="absolute -bottom-4 -right-4 w-1/3 h-auto rounded-xl border border-white/20 shadow-2xl z-20 group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500"
                />
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;