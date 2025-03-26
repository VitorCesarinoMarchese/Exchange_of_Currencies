import React from "react";
import { redirect } from "next/navigation";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "../app/[locale]/page";
import { vi } from "vitest";
import { useLogged } from "../hooks/loggedHook";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en-us.json";

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock("../components/Chart", () => ({
  default: () => <div>Chart</div>,
}));

vi.mock("../components/CurencyConverter", () => ({
  default: () => <div>Currency Converter</div>,
}));

vi.mock("../components/Hero", () => ({
  default: () => <div>Hero</div>,
}));

vi.mock("../components/Navbar", () => ({
  default: ({ logged }: { logged: boolean }) => (
    <div>{logged ? "Logged In" : "Logged Out"}</div>
  ),
}));

vi.mock("../components/wallet", () => ({
  default: () => <div>Wallet</div>,
}));

vi.mock("../hooks/loggedHook", () => ({
  useLogged: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Home Component", () => {
  test("renders the home page when logged in", () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: true });

    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Home />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Logged In")).toBeInTheDocument();
    expect(screen.getByText("Wallet")).toBeInTheDocument();
  });

  test("renders the home page when logged out", () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: false });

    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Home />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Logged Out")).toBeInTheDocument();
    expect(screen.getByText("Hero")).toBeInTheDocument();
  });

  test("handleRedirect should redirect to tradermade.com", async () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: false });

    const originalLocation = window.location;
    delete window.location;
    window.location = { href: "" } as Location;

    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Home />
      </NextIntlClientProvider>
    );

    const button = screen.getByRole("button", { name: "More Info" });

    fireEvent.click(button);

    expect(window.location.href).toBe("https://tradermade.com/");

    window.location = originalLocation;
  });

  test("Should redirect to login", async () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: false });

    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Home />
      </NextIntlClientProvider>
    );

    const button = screen.getByRole("button", { name: "Transactions" });

    fireEvent.click(button);
    await waitFor(() => {
      expect(redirect).toHaveBeenCalled();
    });
  });

  test("Should redirect to history", async () => {
    (useLogged as vi.Mock).mockReturnValue({ logged: true });

    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Home />
      </NextIntlClientProvider>
    );

    const button = screen.getByRole("button", { name: "Transactions" });

    fireEvent.click(button);
    await waitFor(() => {
      expect(redirect).toHaveBeenCalled();
    });
  });
});
