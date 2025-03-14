import { NavLink, useNavigate } from "react-router";
import Btn from "../components/Btn";
import Input from "../components/Input";
import Navbar from "../components/Navbar";
import { useState, FormEvent } from "react";
import { loginService } from "../services/loginService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setLoginLoading(true);
    const { data, error } = await loginService(email, password);
    setLoginLoading(false);

    if (data) {
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("user_email", data.user.email);
      localStorage.setItem("refresh_token", data.refreshToken);
      localStorage.setItem("access_token", data.accessToken);
      navigate("/")
    } else {
      setLoginError(error);
    }
  };            

  

  return (
    <>
    {localStorage.getItem("access_token") ?  navigate("/")  : "" }
      <Navbar logged={false} />
      <div className="flex flex-col items-center mt-8 ">
        <h1 className="text-3xl font-bold mb-7">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <Input
            type="email"
            placeholder="example@email.com"
            className="text-center"
            change={(e) => setEmail(e.target.value)}
            w="w-80 md:w-[500px]"
          />
          <Input
            type="password"
            placeholder="Strong Password"
            className="text-center"
            change={(e) => setPassword(e.target.value)}
            w="w-80 md:w-[500px]"
          />
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

          <Btn
            label={loginLoading ? "Logging in..." : "Login"}
            color="secondary"
            classname="mt-3 mb-1"
            w="w-80 md:w-[500px]"
            disable={loginLoading}
            func={handleSubmit}
          />
        </form>
        <p>
          Don't have an account{" "}
          <NavLink to={"/signup"} className="text-accent underline cursor-pointer">
            click here
          </NavLink>
        </p>
      </div>
    </>
  );
}

export default Login;
