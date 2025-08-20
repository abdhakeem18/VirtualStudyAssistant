import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURLs = {
  v1: "http://192.168.10.60:3001/api/v1",
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
        const userStr = await AsyncStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
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
      if (error.response?.status === 401) {
        
        return Promise.reject(error.response?.data);
      }

      if (error.response?.status !== 401) {
    
        return Promise.reject(error.response?.data);
      }
    }
  );

  return APICALL;
}
export default API;
