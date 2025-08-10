import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedRouteProps {
  children: React.ReactNode;
}

const AnimatedRoute: React.FC<AnimatedRouteProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ 
        duration: 0.3, 
        ease: "easeInOut",
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};

export default AnimatedRoute;
