import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [truckData, setTruckData] = useState(null);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        setTruckData(null);
    };

    return (
        <UserContext.Provider value={{ user, truckData, login, logout, setTruckData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);