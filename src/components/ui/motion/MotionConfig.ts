/**
 * Motion Configuration
 * Shared animation presets and utilities using Framer Motion
 * @requirement P3-ANI-001
 */

import { type Transition, type Variants } from 'framer-motion';

// =====================================================
// Spring Presets
// =====================================================

export const springPresets = {
    /** Bouncy spring - for playful interactions */
    bouncy: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
    } as Transition,

    /** Smooth spring - for subtle movements */
    smooth: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
    } as Transition,

    /** Stiff spring - for snappy feedback */
    stiff: {
        type: 'spring',
        stiffness: 500,
        damping: 35,
    } as Transition,

    /** Gentle spring - for slow, elegant motion */
    gentle: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
    } as Transition,
};

// =====================================================
// Duration Presets
// =====================================================

export const durationPresets = {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    verySlow: 0.8,
};

// =====================================================
// Easing Presets
// =====================================================

export const easingPresets = {
    /** Standard ease out */
    easeOut: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
    /** Standard ease in */
    easeIn: [0.4, 0.0, 1, 1] as [number, number, number, number],
    /** Standard ease in-out */
    easeInOut: [0.4, 0.0, 0.2, 1] as [number, number, number, number],
    /** Anticipation - slight pullback before action */
    anticipate: [0.36, 0, 0.66, -0.56] as [number, number, number, number],
    /** Overshoot - goes past target then settles */
    overshoot: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
};

// =====================================================
// Common Animation Variants
// =====================================================

/** Fade in/out variants */
export const fadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: durationPresets.normal, ease: easingPresets.easeOut }
    },
    exit: {
        opacity: 0,
        transition: { duration: durationPresets.fast, ease: easingPresets.easeIn }
    },
};

/** Scale in/out variants */
export const scaleVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: springPresets.smooth
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: durationPresets.fast }
    },
};

/** Slide from bottom variants */
export const slideUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: springPresets.smooth
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: { duration: durationPresets.fast }
    },
};

/** Slide from right variants */
export const slideRightVariants: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: springPresets.smooth
    },
    exit: {
        opacity: 0,
        x: 20,
        transition: { duration: durationPresets.fast }
    },
};

/** Slide from left variants */
export const slideLeftVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: springPresets.smooth
    },
    exit: {
        opacity: 0,
        x: -20,
        transition: { duration: durationPresets.fast }
    },
};

/** Pop in variants (for modals, tooltips) */
export const popVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: springPresets.bouncy
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        transition: { duration: durationPresets.fast }
    },
};

// =====================================================
// Interactive Hover/Tap Variants
// =====================================================

/** Button hover effect */
export const buttonHoverScale = {
    scale: 1.02,
    transition: springPresets.stiff,
};

export const buttonTapScale = {
    scale: 0.98,
};

/** Card hover effect */
export const cardHoverEffect = {
    y: -4,
    scale: 1.01,
    transition: springPresets.smooth,
};

/** Subtle glow effect (use with boxShadow) */
export const glowEffect = {
    boxShadow: '0 0 20px rgba(30, 64, 175, 0.3)',
    transition: { duration: durationPresets.normal },
};

// =====================================================
// Stagger Children Configuration
// =====================================================

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: springPresets.smooth
    },
};

// =====================================================
// Page Transition Variants
// =====================================================

export const pageTransitionVariants: Variants = {
    initial: {
        opacity: 0,
        y: 8,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: durationPresets.normal,
            ease: easingPresets.easeOut,
        }
    },
    exit: {
        opacity: 0,
        y: -8,
        transition: {
            duration: durationPresets.fast,
            ease: easingPresets.easeIn,
        }
    },
};

// =====================================================
// Drawer/Modal Specific Variants
// =====================================================

export const modalVariants: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 10,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: springPresets.smooth
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: { duration: durationPresets.fast }
    },
};

export const drawerVariants = {
    left: {
        hidden: { x: '-100%' },
        visible: { x: 0, transition: springPresets.smooth },
        exit: { x: '-100%', transition: { duration: durationPresets.fast } },
    } as Variants,
    right: {
        hidden: { x: '100%' },
        visible: { x: 0, transition: springPresets.smooth },
        exit: { x: '100%', transition: { duration: durationPresets.fast } },
    } as Variants,
};

export const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: durationPresets.normal }
    },
    exit: {
        opacity: 0,
        transition: { duration: durationPresets.fast }
    },
};
