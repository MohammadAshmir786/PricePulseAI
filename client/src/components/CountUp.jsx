import { useEffect, useRef } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
} from "framer-motion";

// CountUp keeps the same visual structure as before; only the visibility trigger is fixed.
export default function CountUp({ end, suffix = "", duration = 2.5 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    if (!inView) return undefined;

    const controls = animate(motionValue, end, {
      duration,
      ease: "easeOut",
    });

    return () => controls.stop();
  }, [inView, end, duration, motionValue]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: inView ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}
