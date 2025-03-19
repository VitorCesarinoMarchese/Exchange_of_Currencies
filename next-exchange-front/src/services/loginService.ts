import { LoginResponse } from "../@types/LoginResponseModel";
import { fetchPostApi } from "./apiService";

export const loginService = async (email: string, password: string) => {
  try {
    const response = await fetchPostApi("auth/login", { email, password });
    const data: LoginResponse = await response.json();
    if(response.ok){
      return { data, error: null, loading: false }; 
    }
    return { data: null, error: "Error trying to login", loading: false };
  } catch (error) {
    return { data: null, error: "Error trying to login", loading: false };
  }
};
