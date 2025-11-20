import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Animation = () => {
  // 1. We use a container ref to scope all GSAP animations for easy cleanup
  const componentRef = useRef(null);
  const sliderRef = useRef(null);
  const firstTextRef = useRef(null);
  const secondTextRef = useRef(null);

  // Configuration
  let xPercent = 0;
  let direction = -1; // -1 for left, 1 for right

  useEffect(() => {
    // 2. GPU Acceleration Hint
    gsap.set(sliderRef.current, { willChange: "transform" });

    // 3. GSAP Context for automatic cleanup (React 18+ Best Practice)
    let ctx = gsap.context(() => {
      
      // The Animation Loop
      const animate = () => {
        if (xPercent <= -100) {
          xPercent = 0;
        }
        if (xPercent > 0) {
          xPercent = -100;
        }

        // Set X position
        gsap.set(firstTextRef.current, { xPercent: xPercent });
        gsap.set(secondTextRef.current, { xPercent: xPercent });

        // Move
        requestAnimationFrame(animate);
        xPercent += 0.05 * direction * 7; // Base speed
      };

      // Start Loop
      requestAnimationFrame(animate);

      // 4. ScrollTrigger to affect direction/velocity (Optional)
      // This creates the "drag" effect based on how fast you scroll
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: window.innerHeight,
        onUpdate: (e) => {
          // Changes direction based on scroll direction
          direction = e.direction * -1;
        },
      });

    }, componentRef);

    return () => ctx.revert(); // CLEANS UP everything when component unmounts
  }, []);

  return (
    <div ref={componentRef} className="relative flex h-[35vh] w-full items-center justify-center bg-transparent overflow-hidden">
        {/* Container for the sliding text */}
        <div className="relative flex w-full items-center overflow-hidden py-2">
            <div ref={sliderRef} className="relative flex whitespace-nowrap">
                {/* First Copy */}
                <p ref={firstTextRef} className="m-0 mr-8 text-[8vw] font-bold text-white opacity-80">
                    kanishk soni 🔥 Programmer 👨‍💻 —
                </p>
                {/* Second Copy (Immediate duplicate for seamless loop) */}
                <p ref={secondTextRef} className="absolute left-full top-0 m-0 mr-8 text-[8vw] font-bold text-white opacity-80 pl-8">
                    kanishk soni 🔥 Programmer 👨‍💻 —
                </p>
            </div>
        </div>
    </div>
  );
};

export default Animation;