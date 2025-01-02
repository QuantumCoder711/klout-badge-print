import React, { createContext, useState, ReactNode, useContext } from 'react';

// Define the context type
interface UserContextType {
    userId: number | null;
    setUserId: (userId: number | null) => void;
}

// Create a context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<number | null>(null);

    return (
        <UserContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
