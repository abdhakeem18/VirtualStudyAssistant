import axios from "axios";
import { getData, removeData, setData } from "../screens/components/utils/storage";

const baseURLs = {
  v1: "http://192.168.10.60:3001/api/v1",
  // v1: "http://10.135.18.54:3001/api/v1",
}


const API = (version) => {
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
      // // console.log("error", error);
      if (error.response?.data?.code === 401) {
        console.log('API Error => ', error);
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
