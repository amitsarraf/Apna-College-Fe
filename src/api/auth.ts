import axios from "axios";
import * as url from "./url_helpers";


export const getSignup = async (data: any) => {
  try {
    const response = await axios.post(url.POST_SIGNUP, data);
    if (response.status >= 200 || response.status <= 299) return response;
    throw response;
  } catch (error: any) {
    return error.response;
  }
};


export const getLogin = async (data: any) => {
  try {
    const response = await axios.post(url.POST_LOGIN, data);
    if (response.status >= 200 || response.status <= 299) return response;
    throw response;
  } catch (error: any) {
    return error.response;
  }
};