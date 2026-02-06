import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  glow = false,
  animate = true,
  ...props 
}) => {
  const Component = animate ? motion.div : 'div';
  
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    whileHover: hover ? { y: -5 } : {},
  } : {};

  return (
    <Component
      className={`
        glass rounded-xl p-6 
        ${hover ? 'hover-lift cursor-pointer' : ''}
        ${glow ? 'shadow-cyber' : ''}
        ${className}
      `}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
