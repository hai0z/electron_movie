import axios from "axios";

// const BASE_URL1 = "https://phimapi.com/";

const BASE_URL2 = "https://phim.nguonc.com/api/";
const api = axios.create({
  baseURL: BASE_URL2,
});

export default api;
