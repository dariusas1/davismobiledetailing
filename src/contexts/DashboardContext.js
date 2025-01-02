/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useContext, useCallback } from 'react';
import DashboardService from '../services/dashboardService';
import Logger from '../utils/Logger';
import ErrorHandler from '../utils/ErrorHandler';

// Create context
export const DashboardContext = createContext();

// Error handling wrapper
const withErrorHandling = (callback) => async (...args) => {
    try {
        return await callback(...args);
    } catch (error) {
        ErrorHandler.handleError(error);
        throw error;
    }
};

// Context Provider Component
export const DashboardProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [packages, setPackages] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch Projects
    const fetchProjects = useCallback(withErrorHandling(async () => {
        setIsLoading(true);
        try {
            const projectsData = await DashboardService.fetchProjects();
            setProjects(projectsData || []);
        } catch (error) {
            ErrorHandler.handleError(error, 'Failed to load projects');
            setProjects([]);
        } finally {
            setIsLoading(false);
        }
    }), []);

    // Create Project
    const createProject = useCallback(withErrorHandling(async (projectData) => {
        setIsLoading(true);
        try {
            const newProject = await DashboardService.createProject(projectData);
            setProjects(prev => [...prev, newProject]);
            return newProject;
        } catch (error) {
            ErrorHandler.handleError(error, 'Failed to create project');
            return null;
        } finally {
            setIsLoading(false);
        }
    }), []);

    // Update Project
    const updateProject = useCallback(withErrorHandling(async (projectId, projectData) => {
        setIsLoading(true);
        try {
            const updatedProject = await DashboardService.updateProject(projectId, projectData);
            setProjects(prev => 
                prev.map(project => 
                    project._id === projectId ? updatedProject : project
                )
            );
            return updatedProject;
        } catch (error) {
            ErrorHandler.handleError(error, 'Failed to update project');
            return null;
        } finally {
            setIsLoading(false);
        }
    }), []);

    // Fetch Reviews
    const fetchReviews = useCallback(withErrorHandling(async () => {
        setIsLoading(true);
        try {
            const reviewsData = await DashboardService.fetchReviews();
            setReviews(reviewsData || []);
        } catch (error) {
            ErrorHandler.handleError(error, 'Failed to load reviews');
            setReviews([]);
        } finally {
            setIsLoading(false);
        }
    }), []);

    // Fetch Packages
    const fetchPackages = useCallback(withErrorHandling(async () => {
        setIsLoading(true);
        try {
            const packagesData = await DashboardService.fetchPackages();
            setPackages(packagesData || []);
        } catch (error) {
            ErrorHandler.handleError(error, 'Failed to load packages');
            setPackages([]);
        } finally {
            setIsLoading(false);
        }
    }), []);

    // Fetch Analytics
    const fetchAnalytics = useCallback(withErrorHandling(async () => {
        setIsLoading(true);
        try {
            const analyticsData = await DashboardService.fetchAnalytics();
            setAnalytics(analyticsData || null);
        } catch (error) {
            ErrorHandler.handleError(error, 'Failed to load analytics');
            setAnalytics(null);
        } finally {
            setIsLoading(false);
        }
    }), []);

    // Context value
    const contextValue = {
        projects,
        reviews,
        packages,
        analytics,
        isLoading,
        fetchProjects,
        createProject,
        updateProject,
        fetchReviews,
        fetchPackages,
        fetchAnalytics
    };

    return (
        <DashboardContext.Provider value={contextValue}>
            {children}
        </DashboardContext.Provider>
    );
};

// Custom hook for using dashboard context
export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};

export default DashboardContext;
