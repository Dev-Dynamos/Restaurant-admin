import axios, { AxiosInstance } from "axios";

export const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:4444",
    headers: {
        "Content-Type": "application/json",
    },
});