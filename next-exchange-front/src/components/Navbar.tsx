"use client"
import { List, X } from "@phosphor-icons/react";
import Btn from "./Btn";
import { useState } from "react";
import Link from 'next/link'

function Navbar({ logged }: { logged: boolean }) {
  const [hidden, setHidden] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
    window.location.reload()
  };

  return (
    <nav className="w-full h-24 bg-primary flex items-center justify-between p-4">
      <Link href={"/"}>
        <img src="/logo.svg" alt="Logo" className="max-h-12" />
      </Link>

      <button
        className={hidden ? "md:hidden" : "hidden"}
        onClick={() => setHidden(false)}
        aria-label="open menu"
      >
        <List size={40} />
      </button>
      {logged ? (
        <ul
          className={`${
            hidden ? "hidden md:flex md:flex-row" : "md:flex md:flex-row"
          } absolute top-0 right-0 bg-primary w-[50%] h-screen flex flex-col gap-8 justify-start pt-20 items-center md:w-fit md:h-24 md:pt-0 md:pr-4 md:items-center`}
        >
          <button
            className="absolute top-4 right-4 md:hidden "
            onClick={() => setHidden(true)}
          >
            <X size={40} />
          </button>

          <li>
            <Link href={"/dashboard"}>
              <Btn color="secondary" label="My account" />
            </Link>
          </li>
          <li>
            <Link href={"/history"}>
              <Btn color="secondary" label="History" />
            </Link>
          </li>
          <li>
            <Link href={"/"}>
              <Btn color="secondary" label="Logout" func={handleLogout} />
            </Link>
          </li>
        </ul>
      ) : (
        <ul
          className={`${
            hidden ? "hidden md:flex md:flex-row" : "md:flex md:flex-row"
          } absolute top-0 right-0 bg-primary w-[50%] h-screen flex flex-col gap-8 justify-start pt-20 items-center md:w-fit md:h-24 md:pt-0 md:pr-4 md:items-center`}
        >
          <button
            className="absolute top-4 right-4 md:hidden"
            onClick={() => setHidden(true)}
            aria-label="close menu"
          >
            <X size={40} />
          </button>

          <li>
            <Link href={"/signup"}>
              <Btn color="secondary" label="Signup" />
            </Link>
          </li>
          <li>
            <Link href={"/login"}>
              <Btn color="secondary" label="Login" />
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
