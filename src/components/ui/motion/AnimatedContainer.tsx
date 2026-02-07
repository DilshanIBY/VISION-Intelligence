/**
 * Animated Container Component
 * Generic wrapper for applying common animations
 * @requirement P3-ANI-001
 */

import { type ReactNode, forwardRef } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';
import {
  fadeVariants,
  scaleVariants,
  slideUpVariants,
  slideRightVariants,
  slideLeftVariants,
  popVariants,
  staggerItem,
} from './MotionConfig';

// =====================================================
// Types
// =====================================================

type AnimationType = 'fade' | 'scale' | 'slideUp' | 'slideRight' | 'slideLeft' | 'pop' | 'none';

interface AnimatedContainerProps {
  /** Type of animation */
  animation?: AnimationType;
  /** Custom variants (overrides animation type) */
  variants?: Variants;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Whether to animate on mount */
  animateOnMount?: boolean;
  /** Key for AnimatePresence (for exit animations) */
  presenceKey?: string | number;
  /** Enable hover effects */
  hover?: boolean;
  /** Enable tap effects */
  tap?: boolean;
  /** Children */
  children: ReactNode;
  /** Optional className */
  className?: string;
}

// =====================================================
// Animation Variants Map
// =====================================================

const animationMap: Record<AnimationType, Variants> = {
  fade: fadeVariants,
  scale: scaleVariants,
  slideUp: slideUpVariants,
  slideRight: slideRightVariants,
  slideLeft: slideLeftVariants,
  pop: popVariants,
  none: {},
};

// =====================================================
// Main Component
// =====================================================

export const AnimatedContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  (
    {
      animation = 'fade',
      variants: customVariants,
      delay = 0,
      animateOnMount = true,
      presenceKey,
      hover = false,
      tap = false,
      children,
      className = '',
    },
    ref
  ) => {
    const variants = customVariants || animationMap[animation];

    // Add delay to transition if specified
    const delayedVariants: Variants =
      delay > 0
        ? {
            ...variants,
            visible: {
              ...variants.visible,
              transition: {
                ...(typeof variants.visible === 'object' && 'transition' in variants.visible
                  ? variants.visible.transition
                  : {}),
                delay,
              },
            },
          }
        : variants;

    const content = (
      <motion.div
        ref={ref}
        initial={animateOnMount ? 'hidden' : false}
        animate="visible"
        exit="exit"
        variants={delayedVariants}
        whileHover={hover ? { scale: 1.02 } : undefined}
        whileTap={tap ? { scale: 0.98 } : undefined}
        className={className}
      >
        {children}
      </motion.div>
    );

    // Wrap with AnimatePresence if presenceKey is provided
    if (presenceKey !== undefined) {
      return <AnimatePresence mode="wait">{content}</AnimatePresence>;
    }

    return content;
  }
);

AnimatedContainer.displayName = 'AnimatedContainer';

// =====================================================
// Stagger Container (for lists)
// =====================================================

interface StaggerContainerProps {
  children: ReactNode;
  /** Delay between each child */
  staggerDelay?: number;
  /** Optional className */
  className?: string;
}

export const StaggerContainer = forwardRef<HTMLDivElement, StaggerContainerProps>(
  ({ children, staggerDelay = 0.05, className = '' }, ref) => {
    const customStagger: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate="visible"
        variants={customStagger}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);

StaggerContainer.displayName = 'StaggerContainer';

// =====================================================
// Stagger Item (child of StaggerContainer)
// =====================================================

interface StaggerItemProps {
  children: ReactNode;
  /** Optional className */
  className?: string;
}

export const StaggerItem = forwardRef<HTMLDivElement, StaggerItemProps>(
  ({ children, className = '' }, ref) => {
    return (
      <motion.div ref={ref} variants={staggerItem} className={className}>
        {children}
      </motion.div>
    );
  }
);

StaggerItem.displayName = 'StaggerItem';

// =====================================================
// Fade In When Visible (scroll-triggered)
// =====================================================

interface FadeInWhenVisibleProps {
  children: ReactNode;
  /** Amount of element visible before animating (0-1) */
  threshold?: number;
  /** Optional className */
  className?: string;
}

export const FadeInWhenVisible = forwardRef<HTMLDivElement, FadeInWhenVisibleProps>(
  ({ children, threshold = 0.1, className = '' }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: threshold }}
        variants={fadeVariants}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
);

FadeInWhenVisible.displayName = 'FadeInWhenVisible';

export default AnimatedContainer;
