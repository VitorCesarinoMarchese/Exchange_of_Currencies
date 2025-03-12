import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";

export const PrivateRoutes = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  return token ? <Outlet /> : null;
};
