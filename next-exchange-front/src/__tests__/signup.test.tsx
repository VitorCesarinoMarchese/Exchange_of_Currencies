import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../app/[locale]/signup/page";
import { vi } from "vitest";
import { signupService } from "../services/signupService";
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

vi.mock("../services/signupService", () => ({
  signupService: vi.fn(),
}));
vi.mock("next/navigation", () => ({ 
  redirect: vi.fn(),
  usePathname: vi.fn() 
}));

describe("Register Component", () => {
  test("renders register form correctly", () => {
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Register />
      </NextIntlClientProvider>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Signup");

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("example@email.com")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type in a Strong Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Repeat Password")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /signup/i })).toBeInTheDocument();

    expect(screen.getByText(/Already have an account/i)).toBeInTheDocument();
  });

  test("renders register form in pt-br", () => {
    render(
      <NextIntlClientProvider locale="pt-br" messages={pt}>
        <Register />
      </NextIntlClientProvider>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Cadastrar-se");

    expect(screen.getByPlaceholderText("Nome")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("exemplo@email.com")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Digite uma Senha Forte")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Repita a senha")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Cadastrar-se/i })).toBeInTheDocument();

    expect(screen.getByText(/Já tem uma conta/i)).toBeInTheDocument();
  });

  test("renders register form in es-pe", () => {
    render(
      <NextIntlClientProvider locale="es-pe" messages={es}>
        <Register />
      </NextIntlClientProvider>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Registrarse");

    expect(screen.getByPlaceholderText("Nombre")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("ejemplo@email.com")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Introduce una contraseña segura")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Repite la contraseña")).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Registrarse/i })).toBeInTheDocument();

    expect(screen.getByText(/¿Ya tienes una cuenta?/i)).toBeInTheDocument();
  });

  test("shows error when required fields are missing", async () => {
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Register />
      </NextIntlClientProvider>
    );
    const signupButton = screen.getByRole("button", { name: /signup/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(
        screen.getByText("All fields need to be filled")
      ).toBeInTheDocument();
    });
  });

  test("shows error when passwords do not match", async () => {
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Register />
      </NextIntlClientProvider>
    );

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Type in a Strong Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat Password"), {
      target: { value: "password124" },
    });

    const signupButton = screen.getByRole("button", { name: /signup/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "The password need to be the same of the confirm password"
        )
      ).toBeInTheDocument();
    });
  });

  test("navigates to login on successful signup", async () => {
    (signupService as unknown as jest.Mock) =
      signupService as unknown as jest.Mock;
    (signupService as unknown as jest.Mock).mockResolvedValue({
      data: { message: "Account created successfully", error: null },
      error: null,
    });

    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Register />
      </NextIntlClientProvider>
    );
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Type in a Strong Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat Password"), {
      target: { value: "password123" },
    });

    const signupButton = screen.getByRole("button", { name: /signup/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(signupService).toHaveBeenCalledWith(
        "John Doe",
        "john@example.com",
        "password123"
      );
      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });

  test("displays error from signup service on failure", async () => {
    (signupService as unknown as jest.Mock) =
      signupService as unknown as jest.Mock;
    (signupService as unknown as jest.Mock).mockResolvedValue({
      data: { error: true },
      error: "Email is already taken",
    });

    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Register />
      </NextIntlClientProvider>
    );
    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("example@email.com"), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Type in a Strong Password"), {
      target: { value: "password123" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repeat Password"), {
      target: { value: "password123" },
    });

    const signupButton = screen.getByRole("button", { name: /signup/i });
    fireEvent.click(signupButton);

    await waitFor(() => {
      expect(screen.getByText("Email is already taken")).toBeInTheDocument();
    });
  });
});
