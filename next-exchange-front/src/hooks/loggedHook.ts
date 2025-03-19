import { useEffect, useState } from "react";
import { fetchAuthApi, fetchPostApi } from "../services/apiService";

export const useLogged = () => {
  const [logged, setLogged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!accessToken) {
      console.warn("No access token found in localStorage");
      setError("User doesn't have an access token");
      setLogged(false);
      setLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        let response = await fetchAuthApi("auth/profile", accessToken);

        if (response.status === 403) {
          console.warn("Received 403: Unauthorized or Expired Token");

          if (!refreshToken) {
            localStorage.clear()
            throw new Error("No refresh token available.");
          }

          try {
            const newTokenResponse = await fetchPostApi("auth/refresh-token", { refreshToken });
            const data = await newTokenResponse.json()
            if (!data?.accessToken) {
              throw new Error("Failed to refresh token.");
            }

            localStorage.setItem("access_token", data.accessToken);
            response = await fetchAuthApi("auth/profile", data.accessToken);

            if (response.status !== 200) {
              throw new Error("Failed to authenticate with new token.");
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            localStorage.clear()
            throw refreshError;
          }
        }

        if (response.status === 200) {
          setLogged(true);
          return;
        }

        console.error("Unexpected API Response:", response);
        throw new Error("Unexpected response from API");
      } catch (e) {
        console.error("Authentication failed:", e);
        setError("Authentication failed.");
        setLogged(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { logged, loading, error };
};
