/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
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
import Clock from "./Clock";
import Projects from "./Projects";
import Contact from "./Contact";
import PropTypes from "prop-types";

gsap.registerPlugin(ScrollTrigger);
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Contactme = () => {
  return (
    <DotLottieReact
      src="https://lottie.host/b24a225a-48b3-4301-beba-5df87625820b/fwEWxL9vX1.lottie"
      loop
      className="size-[100px] "
      autoplay
    />
  );
};

// Import sound effects
// Create these files in your assets folder or use placeholder URLs
const grabSoundUrl = "/sounds/grab.mp3"; // Soft click sound when grabbing
const dropSoundUrl = "/sounds/drop.mp3"; // Thud sound when dropping

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
                live in Jaipur and I am {new Date().getFullYear() - 2005} years old. I have been coding for{" "}
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
                    <span className="font-bold ">Kanishk Soni</span>, an
                    {" "}{new Date().getFullYear() - 2005}-year-old coding enthusiast hailing from the vibrant city
                    of Jaipur. Coding has been my passion for{" "}
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
            <Clock />
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
            <Projects />
          </div>
        ) : (
          <div id="Projects">
            <video
              src={video}
              className="w-full h-full object-cover "
              autoPlay
              muted
              loop
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
            <Contact />
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
