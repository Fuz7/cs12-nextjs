import Axios from "axios";

const axiosServerSide = Axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_DOCKER_BACKEND_URL ||
    process.env.INTERNAL_BACKEND_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Origin": process.env.FRONTEND_URL,
    "Referer": process.env.FRONTEND_URL,
  },
  withCredentials: true,
  withXSRFToken: true,
});
axiosServerSide.interceptors.response.use(
  (response) => response, // pass through successful responses
  (error) => {
    // If there's a response, unwrap it
    if (error.response && error.response.data) {
      return Promise.reject(error.response.data);
    }

    // Otherwise reject with the original error (like network errors)
    return Promise.reject(error);
  },
);
export default axiosServerSide;
