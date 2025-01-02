import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [projectsList, setProjectsList] = useState([]);
    const [isProjModalActive, setIsProjModalActive] = useState(false);
    const [projectInfo, setProjectInfo] = useState(null);

    const contextValue = {
        user,
        setUser,
        loading,
        setLoading,
        projectsList,
        setProjectsList,
        isProjModalActive,
        setIsProjModalActive,
        projectInfo,
        setProjectInfo
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook for using AppContext
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
