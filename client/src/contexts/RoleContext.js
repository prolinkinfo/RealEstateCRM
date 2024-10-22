import React, { createContext, useContext, useEffect, useState } from 'react';
import { getApi } from 'services/api';

// Create context
const RoleContext = createContext();

// Create provider
export const RoleProvider = ({ children }) => {
    const [roleData, setRoleData] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'))

    // Fetch user data from API
    useEffect(async () => {
        // Call API here
        // Example using fetch:
        if (user) {
            const response = await getApi(`api/user/view/${user?._id}`)
            setRoleData(response?.data?.roles)
        }
    }, []);

    return (
        <RoleContext.Provider value={roleData}>
            {children}
        </RoleContext.Provider>
    );
};

// Custom hook to access user data
export const useRole = () => useContext(RoleContext);