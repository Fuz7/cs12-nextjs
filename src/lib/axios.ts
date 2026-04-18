import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    
  },
  withCredentials: true,
  withXSRFToken: true,
});
axios.interceptors.response.use(
  (response) => response, // pass through successful responses
  (error) => {
    // If there's a response, unwrap it
    if (error.response && error.response.data) {
      
      return Promise.reject(error.response.data);
    }

    // Otherwise reject with the original error (like network errors)
    return Promise.reject(error);       
  }
);
export default axios;
