/* eslint-disable no-undef */
import { useState, useCallback, useMemo } from 'react';

// Memoization utility for expensive computations
export const useMemoizedValue = (computeValue, dependencies) => {
    return useMemo(computeValue, [computeValue]);
};

// Debounce hook for reducing frequent function calls
export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

// Throttle function to limit execution frequency
export const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Lazy loading component wrapper
export const LazyLoad = React.lazy(() => import('./LazyLoadComponent'));

// Performance monitoring utility
export class PerformanceMonitor {
    static markStart(name) {
        performance.mark(`${name}-start`);
    }

    static markEnd(name) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
    }

    static getLastMeasure(name) {
        const measures = performance.getEntriesByName(name);
        return measures[measures.length - 1];
    }

    static logPerformance(name) {
        const measure = this.getLastMeasure(name);
        console.log(`${name} took ${measure.duration}ms`);
    }
}

// Batch update utility for reducing re-renders
export const useBatchedState = (initialState) => {
    const [state, setState] = useState(initialState);

    const batchedSetState = useCallback((newState) => {
        setState(prevState => ({
            ...prevState,
            ...newState
        }));
    }, []);

    return [state, batchedSetState];
};

// Code splitting and lazy loading configuration
export const lazyLoadRoutes = {
    Dashboard: React.lazy(() => import('../pages/DashboardPage/DashboardPage')),
    Profile: React.lazy(() => import('../pages/ProfilePage/ProfilePage')),
    Bookings: React.lazy(() => import('../pages/BookingsPage/BookingsPage'))
};
