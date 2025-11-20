import { useState, useEffect, useRef } from "react";
import allprojectdata from "../assets/allprojectdata.json";
import "../css/project.css";

const Projects = () => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const videoContainerRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null); // Ref for overlay

  // Prevent background scroll and center overlay when fullscreen
  useEffect(() => {
    if (fullscreenVideo) {
      document.body.style.overflow = "hidden";
      sessionStorage.setItem("fullscreenVideoActive", "true"); // Use sessionStorage
      setTimeout(() => {
        if (overlayRef.current) {
          overlayRef.current.scrollIntoView({
            block: "center",
            inline: "center",
            behavior: "auto",
          });
        }
      }, 0);
    } else {
      document.body.style.overflow = "";
      sessionStorage.removeItem("fullscreenVideoActive"); // Use sessionStorage
    }
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "";
      sessionStorage.removeItem("fullscreenVideoActive");
    };
  }, [fullscreenVideo]);

  // Close fullscreen on Esc
  useEffect(() => {
    if (!fullscreenVideo) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setFullscreenVideo(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreenVideo]);

  // Close fullscreen on clicking outside the video
  const handleOverlayClick = (e) => {
    if (
      videoContainerRef.current &&
      !videoContainerRef.current.contains(e.target)
    ) {
      setFullscreenVideo(null);
    }
  };

  // When fullscreenVideo is set, focus the video and request fullscreen if needed
  useEffect(() => {
    if (fullscreenVideo && videoRef.current) {
      // Optionally, you can auto-request fullscreen here
      // videoRef.current.requestFullscreen();
    }
  }, [fullscreenVideo]);

  return (
    <div className="w-full h-fit flex flex-col justify-start py-6 pt-14 px-2 items-center min-h-screen">
      {/* Fullscreen video overlay */}
      {fullscreenVideo && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90"
          onClick={handleOverlayClick}
        >
          <div
            ref={videoContainerRef}
            className="relative max-w-[90vw] max-h-[90vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white text-4xl font-bold bg-black/50 rounded-full px-3 py-1 z-10"
              onClick={() => setFullscreenVideo(null)}
            >
              &times;
            </button>
            {/* Video */}
            <video
              ref={videoRef}
              src={fullscreenVideo}
              controls
              autoPlay
              loop
              preload="metadata"
              className="w-full h-full object-contain rounded-2xl border-4 border-white bg-black"
            />
            {/* Optional browser fullscreen */}
            <button
              className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm"
              onClick={() => {
                if (videoRef.current && videoRef.current.requestFullscreen) {
                  videoRef.current.requestFullscreen();
                }
              }}
            >
              Browser Fullscreen
            </button>
          </div>
        </div>
      )}

      {/* Only show the selected project when fullscreenVideo is active */}
      {fullscreenVideo ? (
        (() => {
          const selectedIndex = allprojectdata.findIndex(
            (item) => item.video_link === fullscreenVideo
          );
          if (selectedIndex === -1) return null;
          const item = allprojectdata[selectedIndex];
          return (
            <div
              key={selectedIndex}
              className="py-16 gap-14 w-full flex flex-wrap relative justify-center items-center h-fit min-h-[30vh]"
            >
              <div className="w-[45%] flex flex-col min-w-[300px] justify-center items-center h-fit text-center max-md:w-full">
                <div
                  className="videoplayer w-[20%] min-w-[250px] absolute h-[23vh] -top-[9vh] overflow-hidden border-4 rounded-3xl border-white object-cover"
                  style={{ display: "block" }}
                >
                  <video
                    src={item.video_link}
                    autoPlay
                    loop
                    muted
                    preload="none"
                    className="w-full bg-transparent h-full object-cover"
                  ></video>
                  {/* Hide fullscreen button since overlay is already open */}
                </div>
                <div className="flex justify-center items-center gap-3">
                  <h2 className="text-5xl project-name font-['monument']">
                    {item.project_name}
                  </h2>
                  {item.project_link !== "NO_LINK" && (
                    <a
                      href={item.project_link}
                      target="_blank"
                      className="w-fit h-full"
                      rel="noopener noreferrer"
                    >
                      {/* SVG ICON */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-[50px] h-[50px]"
                        fill="currentColor"
                      >
                        <path d="M18.3638 15.5355L16.9496 14.1213L18.3638 12.7071C20.3164 10.7545 20.3164 7.58866 18.3638 5.63604C16.4112 3.68341 13.2453 3.68341 11.2927 5.63604L9.87849 7.05025L8.46428 5.63604L9.87849 4.22182C12.6122 1.48815 17.0443 1.48815 19.778 4.22182C22.5117 6.95549 22.5117 11.3876 19.778 14.1213L18.3638 15.5355ZM15.5353 18.364L14.1211 19.7782C11.3875 22.5118 6.95531 22.5118 4.22164 19.7782C1.48797 17.0445 1.48797 12.6123 4.22164 9.87868L5.63585 8.46446L7.05007 9.87868L5.63585 11.2929C3.68323 13.2455 3.68323 16.4113 5.63585 18.364C7.58847 20.3166 10.7543 20.3166 12.7069 18.364L14.1211 16.9497L15.5353 18.364ZM14.8282 7.75736L16.2425 9.17157L9.17139 16.2426L7.75717 14.8284L14.8282 7.75736Z"></path>
                      </svg>
                    </a>
                  )}
                </div>
                <p className="text-3xl max-md:text-xl">
                  {item.project_description}.
                </p>
              </div>
              <div className="w-[30vw] h-[40vh] min-w-[250px] max-md:-ml-12 min-h-[50px] max-md:max-h-[180px] max-md:max-w-[280px] relative flex justify-center items-end text-center">
                <img
                  src={item.photo_links[0]}
                  loading="lazy"
                  className="w-[full] border-4 max-md:rounded-2xl rounded-3xl border-white object-cover h-full"
                  alt=""
                />
                <img
                  src={item.photo_links[1]}
                  loading="lazy"
                  className="w-[25%] min-w-[90px] max-md:rounded-2xl absolute left-[120%] -translate-x-[120%] border-4 rounded-3xl border-white object-cover h-4/4"
                  alt=""
                />
              </div>
            </div>
          );
        })()
      ) : (
        // Show all projects if no fullscreen video
        <>
          {allprojectdata.map((item, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredProject(index)}
              onMouseLeave={() => setHoveredProject(null)}
              className="py-16 gap-14 w-full flex flex-wrap relative justify-center items-center h-fit min-h-[30vh]"
            >
              <div
                onClick={() => setHoveredProject(index)}
                onDoubleClick={() => setHoveredProject(null)}
                className="w-[45%] flex flex-col min-w-[300px] justify-center items-center h-fit text-center max-md:w-full"
              >
                <div
                  className="videoplayer w-[20%] min-w-[250px] absolute h-[23vh] -top-[9vh] overflow-hidden border-4 rounded-3xl border-white object-cover"
                  style={{
                    display: hoveredProject === index ? "block" : "none",
                  }}
                >
                  <video
                    src={item.video_link}
                    autoPlay
                    loop
                    muted
                    preload="none" // Lazy load preview video
                    className="w-full bg-transparent h-full object-cover"
                  ></video>
                  <button
                    className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFullscreenVideo(item.video_link);
                    }}
                    style={{ zIndex: 10 }}
                  >
                    Fullscreen
                  </button>
                </div>
                <div className="flex justify-center items-center gap-3">
                  <h2 className="text-5xl project-name font-['monument']">
                    {item.project_name}
                  </h2>
                  {item.project_link !== "NO_LINK" && (
                    <a
                      href={item.project_link}
                      target="_blank"
                      className="w-fit h-full"
                      rel="noopener noreferrer"
                    >
                      {/* SVG ICON */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-[50px] h-[50px]"
                        fill="currentColor"
                      >
                        <path d="M18.3638 15.5355L16.9496 14.1213L18.3638 12.7071C20.3164 10.7545 20.3164 7.58866 18.3638 5.63604C16.4112 3.68341 13.2453 3.68341 11.2927 5.63604L9.87849 7.05025L8.46428 5.63604L9.87849 4.22182C12.6122 1.48815 17.0443 1.48815 19.778 4.22182C22.5117 6.95549 22.5117 11.3876 19.778 14.1213L18.3638 15.5355ZM15.5353 18.364L14.1211 19.7782C11.3875 22.5118 6.95531 22.5118 4.22164 19.7782C1.48797 17.0445 1.48797 12.6123 4.22164 9.87868L5.63585 8.46446L7.05007 9.87868L5.63585 11.2929C3.68323 13.2455 3.68323 16.4113 5.63585 18.364C7.58847 20.3166 10.7543 20.3166 12.7069 18.364L14.1211 16.9497L15.5353 18.364ZM14.8282 7.75736L16.2425 9.17157L9.17139 16.2426L7.75717 14.8284L14.8282 7.75736Z"></path>
                      </svg>
                    </a>
                  )}
                </div>
                <p className="text-3xl max-md:text-xl">
                  {item.project_description}.
                </p>
              </div>
              <div className="w-[30vw] h-[40vh] min-w-[250px] max-md:-ml-12 min-h-[50px] max-md:max-h-[180px] max-md:max-w-[280px] relative flex justify-center items-end text-center">
                <img
                  src={item.photo_links[0]}
                  loading="lazy"
                  className="w-[full] border-4 max-md:rounded-2xl rounded-3xl border-white object-cover h-full"
                  alt=""
                />
                <img
                  src={item.photo_links[1]}
                  loading="lazy"
                  className="w-[25%] min-w-[90px] max-md:rounded-2xl absolute left-[120%] -translate-x-[120%] border-4 rounded-3xl border-white object-cover h-4/4"
                  alt=""
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default Projects;
