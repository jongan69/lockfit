import React, { createContext, useState, useContext } from 'react';

const TabBarVisibilityContext = createContext<{
    isTabBarVisible: boolean;
    setTabBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
} | undefined>(undefined);

export const TabBarVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isTabBarVisible, setTabBarVisible] = useState<boolean>(true);

    return (
        <TabBarVisibilityContext.Provider value={{ isTabBarVisible, setTabBarVisible }}>
            {children}
        </TabBarVisibilityContext.Provider>
    );
};

export const useTabBarVisibility = () => useContext(TabBarVisibilityContext);