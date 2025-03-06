import { useEffect, useState } from "react";
import { fetchAuthApi, fetchPostApi } from "../services/apiService";

export const useLogged = () => {
  const [logged, setLogged] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if accessToken exists in localStorage
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken) {
      setError("User doesn't have an access token");
      setLoading(false);
      return;
    }

    fetchAuthApi("auth/profile", accessToken)
      .then((info: { message: string } | { error: string }) => {
        if ((info as { error: string }).error === "Invalid or expired token" && refreshToken) {
          fetchPostApi("auth/refresh-token", { refreshToken })
            .then((newAccessToken: string) => {
              localStorage.setItem("accessToken", newAccessToken);
              setLogged(true); 
            })
            .catch((e) => {
              console.error("Error refreshing token:", e);
              setError("Failed to refresh token.");
            })
            .finally(() => setLoading(false));
        } else if ((info as { message: string }).message) {
          setLogged(true);
        }
      })
      .catch((e) => {
        console.error("Error fetching user data:", e);
        setError("Failed to load user data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { logged, loading, error };
};
