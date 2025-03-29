import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../app/[locale]/login/page";
import { vi } from "vitest";
import { loginService } from "../services/loginService";
import { redirect, usePathname } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en-us.json";
import pt from "../../messages/pt-br.json";
import es from "../../messages/es-pe.json";

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

vi.mock("../components/Btn", () => ({
  default: ({
    label,
    func,
    disable,
    ...props
  }: {
    label: string;
    func: () => void;
    disable: boolean;
    [key: string]: any;
  }) => (
    <button onClick={func} disabled={disable} {...props}>
      {label}
    </button>
  ),
}));

vi.mock("../components/Input", () => ({
  default: ({
    change,
    ...props
  }: {
    change: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [key: string]: any;
  }) => <input onChange={change} {...props} />,
}));

vi.mock("../components/Navbar", () => ({
  default: ({ logged }: { logged: boolean }) => (
    <div>{logged ? "Logged In" : "Logged Out"}</div>
  ),
}));

vi.mock("../services/loginService", () => ({
  loginService: vi.fn(),
}));

vi.mock("next/navigation", () => ({ 
  redirect: vi.fn(), 
  usePathname: vi.fn() 
}));

describe("Login Component", () => {
  test("renders login form correctly", () => {
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Login />
      </NextIntlClientProvider>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Login");

    expect(
      screen.getByPlaceholderText("example@email.com")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Type in a Strong Password")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
  });

  test("renders login form in pt-br", () => {
    render(
      <NextIntlClientProvider locale="pt-br" messages={pt}>
        <Login />
      </NextIntlClientProvider>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Entrar");

    expect(
      screen.getByPlaceholderText("exemplo@email.com")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite uma Senha Forte")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
    expect(screen.getByText(/Não tem uma conta/i)).toBeInTheDocument();
  });

  test("renders login form in es-pe", () => {
    render(
      <NextIntlClientProvider locale="es-pe" messages={es}>
        <Login />
      </NextIntlClientProvider>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Iniciar sesión");

    expect(
      screen.getByPlaceholderText("ejemplo@email.com")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Introduce una contraseña segura")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Iniciar sesión/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/¿No tienes una cuenta?/i)).toBeInTheDocument();
  });

  test("shows error when invalid credentials are provided", async () => {
    (loginService as unknown as jest.Mock).mockResolvedValue({
      data: null,
      error: "Invalid credentials",
    });

    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Login />
      </NextIntlClientProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Type in a Strong Password"), {
      target: { value: "wrongpassword" },
    });

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  test("navigates to homepage on successful login", async () => {
    (loginService as unknown as jest.Mock).mockResolvedValue({
      data: {
        user: { id: 1, email: "test@example.com" },
        accessToken: "token",
      },
      error: null,
    });

    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Login />
      </NextIntlClientProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Type in a Strong Password"), {
      target: { value: "password123" },
    });

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(loginService).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
      expect(redirect).toHaveBeenCalledWith("/");
    });
  });

  test("disables login button when loading", async () => {
    let resolveLogin: (value: any) => void;
    (loginService as unknown as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveLogin = resolve;
        })
    );

    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Login />
      </NextIntlClientProvider>
    );

    const loginButton = screen.getByRole("button", { name: /login/i });
    fireEvent.click(loginButton);
    expect(loginButton).toHaveTextContent("Loading...");
    expect(loginButton).toBeDisabled();

    resolveLogin({
      data: {
        user: { id: 1, email: "test@example.com" },
        accessToken: "token",
      },
      error: null,
    });

    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/");
    });
  });
});
