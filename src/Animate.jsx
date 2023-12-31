import React from 'react'
import { motion } from "framer-motion";

const animations = {
    initial: { opacity: 0, x: 0 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };
  const Animate = ({ children }) => {
    return (
      <motion.div
        variants={animations}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 4 }}
      >
        {children}
      </motion.div>
    );
  };
  export const Animate2 = ({ children }) => {
    return (
      <motion.div
        variants={animations}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 2 }}
      >
        {children}
      </motion.div>
    );
  };
  export default Animate;
