import axios from "axios";
import { BASE_URL } from "./constants";

const config = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const callAPI = async (resource) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${resource}`, config);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const instance = axios.create({
  baseURL: "https://us-central1-zizi-shopping-website.cloudfunctions.net/api",
});
export default instance;
