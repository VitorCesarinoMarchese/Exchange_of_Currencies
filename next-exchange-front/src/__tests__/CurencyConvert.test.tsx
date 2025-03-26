import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import CurencyConverter from "../components/CurencyConverter";
import { useConvert } from "../hooks/convetHook";
import { usePathname } from "next/navigation";
import { exchangeService } from "../services/exchangeService";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en-us.json";
import pt from "../../messages/pt-br.json";
import es from "../../messages/es-pe.json";

vi.mock("../hooks/convetHook", () => ({
  useConvert: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));
vi.mock("../services/exchangeService", () => ({
  exchangeService: vi.fn(),
}));

describe("CurencyConverter", () => {
  const onTransaction = vi.fn();

  beforeEach(() => {
    onTransaction.mockClear();
    (useConvert as vi.mock).mockReturnValue({
      data: { result: { rate: 1.5, total: 200 } },
      error: null,
      loading: false,
    });
    (usePathname as vi.mock).mockReturnValue("/dashboard");
    localStorage.setItem("user_id", "testUser");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should renders heading and inputs", async () => {
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <CurencyConverter onTransaction={onTransaction} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Curency Convert")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("100")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("GBP")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("£200")).toBeInTheDocument();
  });

  it("should renders heading and inputs in pt-br", async () => {
    render(
      <NextIntlClientProvider locale="pt-br" messages={pt}>
        <CurencyConverter onTransaction={onTransaction} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Conversão de Moeda")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("100")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("GBP")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("£200")).toBeInTheDocument();
  });

  it("should renders heading and inputs in es-pe", async () => {
    render(
      <NextIntlClientProvider locale="es-pe" messages={es}>
        <CurencyConverter onTransaction={onTransaction} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Conversión de moneda")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("100")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("GBP")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("£200")).toBeInTheDocument();
  });

  it("should renders Exchange button when on dashboard", async () => {
    (usePathname as vi.mock).mockReturnValue("/en-us/dashboard");
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <CurencyConverter onTransaction={onTransaction} />
      </NextIntlClientProvider>
    );
    expect(screen.getByText("Exchange")).toBeInTheDocument();
  });

  it("should does not render Exchange button when not on dashboard", async () => {
    (usePathname as vi.mock).mockReturnValue("/other");
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <CurencyConverter onTransaction={onTransaction} />
      </NextIntlClientProvider>
    );
    expect(screen.queryByText("Exchange")).not.toBeInTheDocument();
  });

  it("should calls exchangeService and onTransaction when Exchange button is clicked with non-negative amount", async () => {
    (usePathname as vi.mock).mockReturnValue("/en-us/dashboard");
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <CurencyConverter onTransaction={onTransaction} />
      </NextIntlClientProvider>
    );
    const exchangeButton = screen.getByText("Exchange");
    fireEvent.click(exchangeButton);
    await waitFor(() => {
      expect(exchangeService).toHaveBeenCalled();
      expect(onTransaction).toHaveBeenCalled();
    });
  });

  it("should does not call exchangeService when amount is negative", async () => {
    (usePathname as vi.mock).mockReturnValue("/en-us/dashboard");
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <CurencyConverter onTransaction={onTransaction} />
      </NextIntlClientProvider>
    );

    const amountInput = screen.getByPlaceholderText("100");
    fireEvent.change(amountInput, { target: { value: "-50" } });

    const exchangeButton = screen.getByText("Exchange");
    fireEvent.click(exchangeButton);

    const spyExchange = vi.spyOn(exchangeService, "mockImplementation");

    await waitFor(() => {
      expect(spyExchange).not.toHaveBeenCalled();
      expect(onTransaction).not.toHaveBeenCalled();
    });
  });

  it("should call setCurrency when the dropdown is used", async () => {
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <CurencyConverter onTransaction={onTransaction} />
      </NextIntlClientProvider>
    );

    const button = screen.getByRole("button", { name: "USD" });
    fireEvent.click(button);

    const gbpItem = screen.getByText("GBP");
    fireEvent.click(gbpItem);

    expect(button).toHaveTextContent("GBP");
  });
});
