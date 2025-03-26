import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../components/Navbar";
import { redirect } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en-us.json";
import pt from "../../messages/pt-br.json";
import es from "../../messages/es-pe.json";

type NavbarProps = {
  logged: boolean;
};
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

const renderComponent = (
  props: NavbarProps,
  locale: string,
  message: object
) => {
  return render(
    <NextIntlClientProvider locale={locale} messages={message}>
      <Navbar {...props} />
    </NextIntlClientProvider>
  );
};

describe("Navbar behavior", () => {
  describe("Navbar rendering", () => {
    it("Should render unlogged navbar", () => {
      renderComponent({ logged: false }, "en-us", en);
      const loginBtn = screen.queryByText("Login");
      const signupBtn = screen.queryByText("Signup");

      expect(loginBtn).toBeInTheDocument();
      expect(signupBtn).toBeInTheDocument();
    });

    it("Should render logged navbar", () => {
      renderComponent({ logged: true }, "en-us", en);

      const myAccountBtn = screen.queryByText("My account");
      const historyBtn = screen.queryByText("History");
      const logoutBtn = screen.queryByText("Logout");

      expect(myAccountBtn).toBeInTheDocument();
      expect(historyBtn).toBeInTheDocument();
      expect(logoutBtn).toBeInTheDocument();
    });
  });

  describe("Navbar rendering in pt-br", () => {
    it("Should render unlogged navbar", () => {
      renderComponent({ logged: false }, "pt-br", pt);

      const loginBtn = screen.queryByText("Entrar");
      const signupBtn = screen.queryByText("Cadastrar-se");

      expect(loginBtn).toBeInTheDocument();
      expect(signupBtn).toBeInTheDocument();
    });

    it("Should render logged navbar", () => {
      renderComponent({ logged: true }, "pt-br", pt);

      const myAccountBtn = screen.queryByText("Minha conta");
      const historyBtn = screen.queryByText("Histórico");
      const logoutBtn = screen.queryByText("Sair");

      expect(myAccountBtn).toBeInTheDocument();
      expect(historyBtn).toBeInTheDocument();
      expect(logoutBtn).toBeInTheDocument();
    });
  });

  describe("Navbar rendering in es-pe", () => {
    it("Should render unlogged navbar", () => {
      renderComponent({ logged: false }, "es-pe", es);

      const loginBtn = screen.queryByText("Iniciar sesión");
      const signupBtn = screen.queryByText("Registrarse");

      expect(loginBtn).toBeInTheDocument();
      expect(signupBtn).toBeInTheDocument();
    });

    it("Should render logged navbar", () => {
      renderComponent({ logged: true }, "es-pe", es);

      const myAccountBtn = screen.queryByText("Mi cuenta");
      const historyBtn = screen.queryByText("Historial");
      const logoutBtn = screen.queryByText("Cerrar sesión");

      expect(myAccountBtn).toBeInTheDocument();
      expect(historyBtn).toBeInTheDocument();
      expect(logoutBtn).toBeInTheDocument();
    });
  });

  describe("Navbar functionality", () => {
    it("Should toggle menu visibility when clicking hamburger icon", () => {
      renderComponent({ logged: false }, "en-us", en);

      const menuButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(menuButton);

      const ul = screen.queryByRole("list");

      expect(ul).not.toHaveClass("hidden");

      const closeButton = screen.queryByRole("button", { name: /close menu/i });
      if (closeButton) {
        fireEvent.click(closeButton);
        expect(ul).toHaveClass("hidden");
      } else {
        throw new Error("Close button not found");
      }
    });

    it("Should call handleLogout and remove localStorage items when clicking Logout", () => {
      renderComponent({ logged: true }, "en-us", en);

      const logoutBtn = screen.queryByText("Logout");
      if (logoutBtn) fireEvent.click(logoutBtn);

      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
      expect(localStorage.getItem("user_email")).toBeNull();
      expect(localStorage.getItem("user_id")).toBeNull();
    });
  });
});
