import { LoginResponse } from "../models/LoginResponseModel";
import { fetchPostApi } from "./apiService";

export const loginService = async (email: string, password: string) => {
  try {
    const response = await fetchPostApi("auth/login", { email, password });
    const data: LoginResponse = await response;
    return { data, error: null, loading: false }; 
  } catch (error) {
    console.error(error);
    return { data: null, error: "Error trying to login", loading: false };
  }
};
