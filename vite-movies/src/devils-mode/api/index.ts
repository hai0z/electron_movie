import axios from "axios";

const api = axios.create({
  baseURL: " https://avdbapi.com/api.php/",
  headers: {
    "Access-Control-Allow-Origin": true,
  },
});

export default api;
