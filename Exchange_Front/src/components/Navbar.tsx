import { List, X } from "@phosphor-icons/react";
import Btn from "./Btn";
import { useState } from "react";
import { NavLink } from "react-router";

function Navbar({ logged }: { logged: boolean }) {
  const [hidden, setHidden] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_id");
  };

  return (
    <nav className="w-full h-24 bg-primary flex items-center justify-between p-4">
      <NavLink to={"/"}>
        <img src="/logo.svg" alt="Logo" className="max-h-12" />
      </NavLink>

      <button
        className={hidden ? "" : "hidden"}
        onClick={() => setHidden(false)}
        aria-label="open menu"
      >
        <List size={40} />
      </button>
      {logged ? (
        <ul
          className={`${
            hidden ? "hidden" : ""
          } absolute top-0 right-0 bg-primary w-[50%] h-screen flex flex-col gap-8 justify-start pt-20 items-center`}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setHidden(true)}
          >
            <X size={40} />
          </button>

          <li>
            <NavLink to={"/dashboard"}>
              <Btn color="secondary" label="My account" />
            </NavLink>
          </li>
          <li>
            <NavLink to={"/history"}>
              <Btn color="secondary" label="History" />
            </NavLink>
          </li>
          <li>
            <NavLink to={"/"}>
              <Btn color="secondary" label="Logout" func={handleLogout} />
            </NavLink>
          </li>
        </ul>
      ) : (
        <ul
          className={`${
            hidden ? "hidden" : ""
          } absolute top-0 right-0 bg-primary w-[50%] h-screen flex flex-col gap-8 justify-start pt-20 items-center`}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setHidden(true)}
            aria-label="close menu"
          >
            <X size={40} />
          </button>

          <li>
            <NavLink to={"/signup"}>
              <Btn color="secondary" label="Signup" />
            </NavLink>
          </li>
          <li>
            <NavLink to={"/login"}>
              <Btn color="secondary" label="Login" />
            </NavLink>
          </li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
