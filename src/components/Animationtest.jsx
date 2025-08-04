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
    <div className=" text-white h-[35vh] bg-black  overflow-hidden w-[97vw] overflow-x-hidden bg-transparent absolute flex items-center gap-7 justify-start  ">
      < ScrollVelocity texts={["kanishk soni 🔥", "Programmer 👨‍💻"]}
      velocity={123}
      className="custom-scroll-text  bg-black py-2  " />
     
    </div>
  );
};

export default Animation;
