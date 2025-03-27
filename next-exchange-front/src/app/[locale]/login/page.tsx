"use client"
import Link from 'next/link'
import { redirect } from 'next/navigation'
import Btn from "../../../components/Btn";
import Input from "../../../components/Input";
import Navbar from "../../../components/Navbar";
import { useState, FormEvent, useEffect } from "react";
import { loginService } from "../../../services/loginService";
import { useTranslations } from 'next-intl';
import Footer from '@/components/Footer';

function Login() {
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [access_token, setAccess_token] = useState<string | undefined>()
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
      redirect("/")
    } else {
      setLoginError(error);
    }
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        setAccess_token(access_token);
      }
    }
  }, [])            

  

  return (
    <>
    {access_token ?  redirect("/")  : "" }
      <Navbar logged={false} />
      <div className="flex flex-col items-center mt-8 min-h-[80vh]">
        <h1 className="text-3xl font-bold mb-7">{t("Login")}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3">
          <Input
            type="email"
            placeholder={t("example@email")}
            className="text-center"
            change={(e) => setEmail(e.target.value)}
            w="w-80 md:w-[500px]"
          />
          <Input
            type="password"
            placeholder={t("Strong Password")}
            className="text-center"
            change={(e) => setPassword(e.target.value)}
            w="w-80 md:w-[500px]"
          />
          {loginError && <p className="text-red-500 text-sm">{loginError}</p>}

          <Btn
            label={loginLoading ? t("Loading") + "..." : t("Login")}
            color="secondary"
            classname="mt-3 mb-1"
            w="w-80 md:w-[500px]"
            disable={loginLoading}
            func={handleSubmit}
          />
        </form>
        <p>
          {t("Don't have an account")}{" "}
          <Link href={"/signup"} className="text-accent underline cursor-pointer">
            {t("click here")}
          </Link>
        </p>
      </div>
      <Footer/>
    </>
  );
}

export default Login;
