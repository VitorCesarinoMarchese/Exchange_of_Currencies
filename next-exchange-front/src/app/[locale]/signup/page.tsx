"use client";
import { redirect } from "next/navigation";
import Link from "next/link";
import Btn from "../../../components/Btn";
import Input from "../../../components/Input";
import Navbar from "../../../components/Navbar";
import { FormEvent, useState, useEffect } from "react";
import { signupService } from "../../../services/signupService";
import { useTranslations } from "next-intl";

function Register() {
  const t = useTranslations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);
  const [access_token, setAccess_token] = useState<string | undefined>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const access_token = localStorage.getItem("access_token");
      if (access_token) {
        setAccess_token(access_token);
      }
    }
  }, []);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setSignupError(t("All fields need to be filled"));
      setSignupLoading(false);
      return;
    }
    if (password != confirmPassword) {
      setSignupError(
        t("The password need to be the same of the confirm password")
      );
      setSignupLoading(false);
      return;
    }
    setSignupLoading(true);
    const { data, error } = await signupService(name, email, password);

    setSignupLoading(false);

    if (data.error) {
      setSignupError(error);
      setSignupLoading(false);
      return;
    }

    if (data.message) {
      redirect("/login");
    }
  };

  return (
    <>
      {access_token ? redirect("/") : ""}
      <Navbar logged={false} />
      <div className="flex flex-col items-center mt-8 ">
        <h1 className="text-3xl font-bold mb-7">{t("Signup")}</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-3"
        >
          <Input
            type="name"
            placeholder={t("Name")}
            className="text-center"
            change={(e) => setName(e.target.value)}
            w="w-80 md:w-[500px]"
          />
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
          <Input
            type="password"
            placeholder={t("Repeat Password")}
            className="text-center"
            change={(e) => setConfirmPassword(e.target.value)}
            w="w-80 md:w-[500px]"
          />
          {signupError && <p className="text-red-500 text-sm">{signupError}</p>}

          <Btn
            label={signupLoading ? t("Loading")+"..." : t("Signup")}
            color="secondary"
            classname="mt-3 mb-1"
            w="w-80 md:w-[500px]"
            disable={signupLoading}
            func={handleSubmit}
          />
        </form>
        <p>
          {t("Already have an account")}{" "}
          <Link
            href={"/login"}
            className="text-accent underline cursor-pointer"
          >
            {t("click here")}
          </Link>
        </p>
      </div>
    </>
  );
}

export default Register;
