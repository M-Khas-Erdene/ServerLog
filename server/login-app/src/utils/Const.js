import { useState, useEffect } from 'react';
export const useToken = () => {
    const [token, setToken] = useState("");

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            console.log("Token found: ", storedToken);
            setToken(storedToken);
        } else {
            console.log("Token not found");
        }
    }, []);

    return token;
};
export const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    d.setHours(d.getHours() + 8);
    return d.toISOString().slice(0, 16);
};

export const isValidIP = (address) => {
    const ipPattern = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;
    return ipPattern.test(address);
};

export const validate = (server_name, location, internal_address, external_address, status) => {
    let errors = {};

    if (!server_name) errors.server_name = "Server name is required.";
    if (!location) errors.location = "Location is required.";
    if (!internal_address) errors.internal_address = "Internal address is required.";
    if (!external_address) errors.external_address = "External address is required.";
    if (!isValidIP(internal_address)) errors.internal_address = "Invalid internal address format.";
    if (!isValidIP(external_address)) errors.external_address = "Invalid external address format.";
    if (!status) errors.status = "Status is required.";

    return errors;
};