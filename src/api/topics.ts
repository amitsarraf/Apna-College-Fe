import axios from "axios";
import * as url from "./url_helpers";

// Create an instance of Axios
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            error.response.status > 400 &&
            error.response.status < 404
        ) {
            localStorage.clear();
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

// Set the Authorization header using the accessToken from localStorage
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            config.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getAllTopics = async () => {
    try {
        const response = await axiosInstance.get(url.GET_ALL_TOPICS);
        if (response.status >= 200 || response.status <= 299) return response.data;
        throw response.data;
    } catch (error: any) {
        return error.response;
    }
};

export const updateTopicStatus = async (data: any) => {
    try {
        const response = await axiosInstance.put(url.UPDATE_TOPIC_STATUS, data);
        if (response.status >= 200 || response.status <= 299) return response.data;
        throw response.data;
    } catch (error: any) {
        return error.response;
    }
};