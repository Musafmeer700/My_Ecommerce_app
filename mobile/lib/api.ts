import { useAuth } from "@clerk/clerk-expo"
import axios from "axios"
import { useEffect } from "react"

const API_URL = "https://myecommerceapp-78xqp.sevalla.app/api"

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-type": "application/json"
    }
})

export const useApi = () => {
    const {getToken} = useAuth();
    
    useEffect(() => {
        const interceptor = api.interceptors.request.use(async (config) => {
            const token = await getToken();

            if(token) {
                config.headers.Authorization =  `Bearer ${token}`
            }
            return config;
        }); 

        return () => {
            api.interceptors.request.eject(interceptor)
        }
    }, [getToken]);

    return api;
};