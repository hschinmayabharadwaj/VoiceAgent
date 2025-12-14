import { Variants } from 'framer-motion';

// Fade variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

// Slide variants
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] // Custom cubic bezier for smooth motion
    }
  },
  exit: { 
    opacity: 0, 
    y: -50,
    transition: { duration: 0.4, ease: 'easeIn' }
  }
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    y: 50,
    transition: { duration: 0.4, ease: 'easeIn' }
  }
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    x: -100,
    transition: { duration: 0.4, ease: 'easeIn' }
  }
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    x: 100,
    transition: { duration: 0.4, ease: 'easeIn' }
  }
};

// Scale variants
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

export const bounceInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.68, -0.55, 0.265, 1.55]
    }
  }
};

// Stagger container variants
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

// Page transition variants
export const pageTransitionVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: 'easeOut' 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { 
      duration: 0.3, 
      ease: 'easeIn' 
    }
  }
};

// Card hover variants
export const cardHoverVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -5,
    transition: { 
      duration: 0.3, 
      ease: 'easeOut' 
    }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Button press variants
export const buttonPressVariants: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

// Rotation variants
export const rotateVariants: Variants = {
  initial: { rotate: 0 },
  animate: { 
    rotate: 360,
    transition: { 
      duration: 20, 
      ease: 'linear', 
      repeat: Infinity 
    }
  }
};

// Text reveal variants (for character-by-character animation)
export const textRevealContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1
    }
  }
};

export const textRevealCharVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};

// Pulse variants
export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

// Float variants
export const floatVariants: Variants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      ease: 'easeInOut',
      repeat: Infinity
    }
  }
};

// Shimmer effect variants
export const shimmerVariants: Variants = {
  shimmer: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity
    }
  }
};

// Modal/Dialog variants
export const modalVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 20 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: [0.22, 1, 0.36, 1] 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

// Toast/Notification variants
export const toastVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: 100, 
    scale: 0.9 
  },
  visible: { 
    opacity: 1, 
    x: 0, 
    scale: 1,
    transition: { 
      type: 'spring', 
      stiffness: 200, 
      damping: 20 
    }
  },
  exit: { 
    opacity: 0, 
    x: 100, 
    scale: 0.9,
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};

// Typing indicator variants
export const typingDotVariants: Variants = {
  initial: { y: 0 },
  animate: {
    y: [-5, 0, -5],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: 'easeInOut'
    }
  }
};

// Spring animation config
export const springConfig = {
  type: 'spring',
  stiffness: 300,
  damping: 25
};

export const softSpringConfig = {
  type: 'spring',
  stiffness: 100,
  damping: 20
};
