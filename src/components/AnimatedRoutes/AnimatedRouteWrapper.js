import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: { 
    opacity: 0, 
    x: '-100vw',
    scale: 0.8 
  },
  in: { 
    opacity: 1, 
    x: 0,
    scale: 1 
  },
  out: { 
    opacity: 0, 
    x: '100vw',
    scale: 1.2 
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const AnimatedRouteWrapper = ({ children }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRouteWrapper;
