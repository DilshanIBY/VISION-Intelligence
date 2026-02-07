/**
 * Page Transition Component
 * Wrapper for animating page transitions in router
 * @requirement P3-ANI-002
 */

import { type ReactNode, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageTransitionVariants } from './MotionConfig';

// =====================================================
// Types
// =====================================================

interface PageTransitionProps {
    children: ReactNode;
    /** Optional custom class */
    className?: string;
}

// =====================================================
// Page Transition Wrapper
// =====================================================

/**
 * Wrap your route content with this component for page transitions.
 * Place inside the route element, not around the Routes component.
 * 
 * @example
 * <Route 
 *   path="/dashboard" 
 *   element={
 *     <PageTransition>
 *       <DashboardPage />
 *     </PageTransition>
 *   } 
 * />
 */
export const PageTransition = forwardRef<HTMLDivElement, PageTransitionProps>(
    ({ children, className = '' }, ref) => {
        const location = useLocation();

        return (
            <AnimatePresence mode="wait">
                <motion.div
                    ref={ref}
                    key={location.pathname}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageTransitionVariants}
                    className={`w-full h-full ${className}`}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        );
    }
);

PageTransition.displayName = 'PageTransition';

// =====================================================
// Simple Fade Page (no location dependency)
// =====================================================

interface FadePageProps {
    children: ReactNode;
    className?: string;
}

/**
 * Simple fade transition without location dependency.
 * Use when you need page-level fade without router integration.
 */
export const FadePage = forwardRef<HTMLDivElement, FadePageProps>(
    ({ children, className = '' }, ref) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`w-full h-full ${className}`}
            >
                {children}
            </motion.div>
        );
    }
);

FadePage.displayName = 'FadePage';

// =====================================================
// Route Transition Container (for Routes wrapper)
// =====================================================

interface RouteTransitionContainerProps {
    children: ReactNode;
}

/**
 * Wrap around your Routes component for exit animations.
 * 
 * @example
 * <RouteTransitionContainer>
 *   <Routes>
 *     <Route path="/" element={<PageTransition><Home /></PageTransition>} />
 *   </Routes>
 * </RouteTransitionContainer>
 */
export const RouteTransitionContainer = ({ children }: RouteTransitionContainerProps) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <div key={location.pathname}>
                {children}
            </div>
        </AnimatePresence>
    );
};

export default PageTransition;
