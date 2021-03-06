import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:3001" });

// API.interceptors.request.use((req) => {
//   if (localStorage.getItem("calendarToken")) {
//     req.headers.Authorization = `Bearer ${localStorage.getItem(
//       "calendarToken"
//     )}`;
//   }

//   return req;
// });

export const fetchEvents = () => API.get("/api", { withCredentials: true });
export const decodeAndFetch = (token) => API.post("/api", token);
