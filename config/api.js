import axios from "axios";
import { getData, removeData, setData } from "../utils/storage";

const baseURLs = {
  // v1: "http://172.20.10.2:3001/api/v1", // local server
  v1: "http://146.190.6.102:3000/api/v1", // production server
}


const API = (version) => {
  // console.log('API Call => ', baseURLs[version]);
  const APICALL = axios.create({
    baseURL: baseURLs[version],
    headers: {
      "Content-Type": "application/json",
    },
  });

  APICALL.interceptors.request.use(
    async (config) => {
      try {
        const user = await getData("user");
        if (user && user.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
      } catch (e) {
        console.log(e);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  APICALL.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.data?.code === 401) {
        await setData("tokenError", "Access token expired");
        await removeData("user");
        return Promise.reject(error.response?.data);
      }

      if (error.response?.data?.code !== 401) {
    
        return Promise.reject(error.response?.data);
      }
    }
  );

  return APICALL;
}
export default API;
