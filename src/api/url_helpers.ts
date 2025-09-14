export const baseURL =  import.meta.env.VITE_API_URL;

export const POST_SIGNUP = `${baseURL}/api/register`;
export const POST_LOGIN = `${baseURL}/api/login`;
export const GET_CURRENT_USER = `${baseURL}/api/getCurrentUser`;

// Interview 

export const GET_ALL_INTERVIEWS = `${baseURL}/api/get-all-interviews`;
export const CREATE_INTERVIEW = `${baseURL}/api/create-interview`;
export const UPDATE_INTERVIEW = `${baseURL}/api/update-interview`;
export const DELETE_INTERVIEW = `${baseURL}/api/delete-interview`;
export const GET_SINGLE_INTERVIEW = `${baseURL}/api/get-interview/:id`;


// submission
export const CREATE_SUBMISSION = `${baseURL}/api/create-submission`;
export const GET_ALL__SUBMISSION = `${baseURL}/api/get-all-submission`;
export const UPDATE_SUBMISSION = `${baseURL}/api/update-submission`;



