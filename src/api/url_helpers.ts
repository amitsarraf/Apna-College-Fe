export const baseURL =  import.meta.env.VITE_API_URL;

export const POST_LOGIN = `${baseURL}/api/login`;
export const GET_CURRENT_USER = `${baseURL}/api/getCurrentUser`;
export const GET_ALL_TOPICS = `${baseURL}/api/get-all-topic`;
export const UPDATE_TOPIC_STATUS = `${baseURL}/api/update-topic`;