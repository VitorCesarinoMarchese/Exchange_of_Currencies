import { fetchPostApi } from "./apiService";

export const signupService = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await fetchPostApi("auth/register", {
      name,
      email,
      password,
    });
    const data = await response.json();
    if(response.ok){
      return { data, error: null, loading: false };
    }
    return { data: null, error: "Error trying to signup", loading: false };
  } catch (e) {
    console.error(e);
    return { data: null, error: "Error trying to signup", loading: false };
  }
};
