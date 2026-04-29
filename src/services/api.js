import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  // baseURL: 'http://10.0.2.2:3000/api', // Android emulator → localhost
  // baseURL: 'http://localhost:3000/api', // iOS simulator
  baseURL: "http://192.168.15.2:3000/api", // dispositivo físico
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de request: injeta o token em toda requisição
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("@appscholar:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor de response: trata 401 globalmente
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove([
        "@appscholar:token",
        "@appscholar:usuario",
      ]);
      // Navegação para login tratada no AuthContext
    }
    return Promise.reject(error);
  },
);

export default api;
