import { useMemo } from 'react';
import axios from 'axios';


const useAxios = () => {

    return useMemo(() => {
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:5000/',
            timeout: 1000,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });

        axiosInstance.interceptors.response.use(
            response => response, 
            error => {
                if (error.response && error.response.status === 403) {
                    localStorage.removeItem('token');
                    window.location.reload();
                }
                return Promise.reject(error);
            }
        );

        return axiosInstance;
    }, []);
};

export default useAxios;
