import axios from "axios";
import { BASE_API_URL } from "@/global";

const axiosInstance = axios.create({
    baseURL: BASE_API_URL
});

type ApiResponse<T = any> = {
    status: boolean;
    data?: T;
    message?: string;
};

export const get = async (url: string, token: string): Promise<ApiResponse> => {
    try {
        let headers = {
            "Authorization": token ? `Bearer ${token}` : ''
        };
        let result = await axiosInstance.get(url, { headers });

        return {
            status: true,
            data: result.data
        };
    } catch (error: any) {
        console.error("Error Response:", error.response?.data); // Debugging

        return {
            status: false,
            message: error.response?.data?.message ?? "An unknown error occurred"
        };
    }
};

export const post = async (url: string, data: string | FormData, token: string): Promise<ApiResponse> => {
    try {
        const contentType = typeof data === "string" ? "application/json" : "multipart/form-data";
        let headers = {
            "Authorization": token ? `Bearer ${token}` : '',
            "Content-Type": contentType
        };

        let result = await axiosInstance.post(url, data, { headers });

        return {
            status: true,
            data: result.data
        };
    } catch (error: any) {
        console.error("Error Response:", error.response?.data); // Debugging

        return {
            status: false,
            message: error.response?.data?.message ?? "An unknown error occurred"
        };
    }
};

export const put = async (url: string, data: string | FormData, token: string): Promise<ApiResponse> => {
    try {
        const contentType = typeof data === "string" ? "application/json" : "multipart/form-data";
        let headers = {
            "Authorization": token ? `Bearer ${token}` : '',
            "Content-Type": contentType
        };

        let result = await axiosInstance.put(url, data, { headers });

        return {
            status: true,
            data: result.data
        };
    } catch (error: any) {
        console.error("Error Response:", error.response?.data); // Debugging

        return {
            status: false,
            message: error.response?.data?.message ?? "An unknown error occurred"
        };
    }
};

export const drop = async (url: string, token: string): Promise<ApiResponse> => {
    try {
        let headers = {
            "Authorization": token ? `Bearer ${token}` : '',
        };

        let result = await axiosInstance.delete(url, { headers });

        return {
            status: true,
            data: result.data
        };
    } catch (error: any) {
        console.error("Error Response:", error.response?.data); // Debugging

        return {
            status: false,
            message: error.response?.data?.message ?? "An unknown error occurred"
        };
    }
};
