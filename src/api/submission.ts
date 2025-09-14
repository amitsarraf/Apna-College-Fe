import axios from "axios";
import * as url from "./url_helpers";

// Create an instance of Axios
const axiosInstance = axios.create();

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (
//             error.response &&
//             error.response.status > 400 &&
//             error.response.status < 404
//         ) {
//             localStorage.clear();
//             window.location.href = "/";
//         }
//         return Promise.reject(error);
//     }
// );

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



export const createSubmission = async (data: any) => {
    try {
        const response = await axiosInstance.post(url.CREATE_SUBMISSION, data);
        if (response.status >= 200 || response.status <= 299) return response;
        throw response;
    } catch (error: any) {
        return error.response;
    }
};

export const getAllSubmission = async () => {
    try {
        const response = await axiosInstance.get(url.GET_ALL__SUBMISSION);
        if (response.status >= 200 || response.status <= 299) return response.data;
        throw response;
    } catch (error: any) {
        return error.response;
    }
};

export const updateSubmission = async (id: string , data: any) => {
    try {
        const response = await axiosInstance.put(`${url.UPDATE_SUBMISSION}/${id}`, data);
        if (response.status >= 200 || response.status <= 299) return response.data;
        throw response.data;
    } catch (error: any) {
        return error.response;
    }
};
