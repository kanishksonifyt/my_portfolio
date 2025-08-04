import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollVelocity from "./utils/Textdrag";

gsap.registerPlugin(ScrollTrigger);

const Animation = () => {
  const no01 = useRef([]);
  const no02 = useRef([]);

  useEffect(() => {
    const boxWidth = 250;
    const totalWidth = boxWidth * 7;
    const dirFromLeft = "+=" + totalWidth;
    const dirFromRight = "-=" + totalWidth;
    const mod = gsap.utils.wrap(0, totalWidth);

    const marquee = (which, time, direction) => {
      gsap.set(which.current, {
        x: (i) => i * boxWidth,
      });

      return gsap.timeline().to(which.current, {
        x: direction,
        modifiers: {
          x: (x) => mod(parseFloat(x)) + "px",
        },
        duration: time,
        ease: "none",
        repeat: -1,
      });
    };

    const master = gsap
      .timeline({ paused: true })
      .add(marquee(no01, 15, dirFromLeft))
      .add(marquee(no02, 20, dirFromRight), 0);

    master.play();

    ScrollTrigger.create({
      trigger: ".wrapper",
      start: "top 80%",
      end: "top -20%",

      onEnter: () => master.play(),
      onLeave: () => master.reverse(),
      onLeaveBack: () => master.reverse(),
      onEnterBack: () => master.play(),
    });
  }, []);

  return (
    <div className=" text-white h-[35vh] bg-black w-[97vw] overflow-x-hidden bg-transparent absolute flex items-center gap-7 justify-start">
      < ScrollVelocity texts={["kanishk soni 🔥", "Programmer 👨‍💻"]}
      velocity={123}
      className="custom-scroll-text  bg-black pb-5" />
      {/* <div
        id="no01"
        className="wrapper w-3/2 h-fit absolute left-1/2 transform -translate-x-1/2 top-1/2 bg-black"
      >
        <div
          className="boxes relative left-[-250px] h-fit flex"
          ref={(el) => (no01.current = el)}
        >
          {[
            ,
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
            "kanishk soni 🔥",
          ].map((text, index) => (
            <div
              key={index}
              className="box w-fit h-fit font-['monument'] max-md:text-2xl   whitespace-nowrap    text-white font-bold text-5xl flex items-center justify-start"
            >
              {text}
            </div>
          ))}
        </div>
      </div>
      <div
        id="no02"
        className="wrapper w-3/2 h-fit absolute left-1/2 transform -translate-x-1/2 top-1/2 mt-12 bg-black overflow-hidden"
      >
        <div
          className="boxes relative left-[-250px] h-12  flex"
          ref={(el) => (no02.current = el)}
        >
          {[
            "Programmer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
            "web developer 👨‍💻",
          ].map((text, index) => (
            <div
              key={index}
              className="box w-fit h-fit font-['monument'] max-md:text-2xl  whitespace-nowrap    text-white font-bold text-5xl flex items-center justify-start"
            >
              {text}
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Animation;
