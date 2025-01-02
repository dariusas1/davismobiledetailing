/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect } from 'react';
import configValidator from '../config/configValidator';

export const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({
        apiBaseUrl: configValidator.get('apiBaseUrl'),
        socketUrl: configValidator.get('socketUrl'),
        features: {
            bookingEnabled: configValidator.getFeatureFlag('bookingEnabled'),
            paymentEnabled: configValidator.getFeatureFlag('paymentEnabled'),
            adminDashboard: configValidator.getFeatureFlag('adminDashboard')
        },
        logger: configValidator.createLogger()
    });

    useEffect(() => {
        // Validate configuration on mount
        try {
            configValidator.validateConfig();
        } catch (error) {
            config.logger.error('Configuration Validation Failed', error);
        }

        // Optional: Fetch remote configuration
        const fetchRemoteConfig = async () => {
            const remoteConfig = await configValidator.fetchRemoteConfig();
            if (remoteConfig) {
                setConfig(prevConfig => ({
                    ...prevConfig,
                    ...remoteConfig
                }));
            }
        };

        fetchRemoteConfig();
    }, []);

    return (
        <ConfigContext.Provider value={config}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = React.useContext(ConfigContext);
    if (context === undefined) {
        throw new Error('useConfig must be used within a ConfigProvider');
    }
    return context;
};
