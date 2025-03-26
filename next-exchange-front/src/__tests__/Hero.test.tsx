import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Hero from "../components/Hero";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en-us.json";
import pt from "../../messages/pt-br.json";
import es from "../../messages/es-pe.json";

describe("Hero Component", () => {
  it("renders the title and description text", () => {
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Hero />
      </NextIntlClientProvider>
    );

    const titleElement = screen.getByText("Wallet Feature");
    expect(titleElement).toBeInTheDocument();

    const descriptionElement = screen.getByText(
      "With the wallet feature, users can easily manage their balances in USD and GBP. It offers an easy-to-use interface for tracking balances, making transfers, and managing funds across different currencies."
    );
    expect(descriptionElement).toBeInTheDocument();
  });

  it("renders the title and description text in pt-br", () => {
    render(
      <NextIntlClientProvider locale="pr-br" messages={pt}>
        <Hero />
      </NextIntlClientProvider>
    );

    const titleElement = screen.getByText("Feature de Carteira");
    expect(titleElement).toBeInTheDocument();

    const descriptionElement = screen.getByText(
      "Com a feature de carteira, os usuários podem gerenciar seus saldos em USD e GBP com facilidade. Ele fornece uma interface intuitiva para acompanhar saldos, efetuar transferências e administrar fundos em diversas moedas."
    );
    expect(descriptionElement).toBeInTheDocument();
  });

  it("renders the title and description text in es-pe", () => {
    render(
      <NextIntlClientProvider locale="es-pe" messages={es}>
        <Hero />
      </NextIntlClientProvider>
    );

    const titleElement = screen.getByText("Función de billetera");
    expect(titleElement).toBeInTheDocument();

    const descriptionElement = screen.getByText(
      "Con la función de billetera, los usuarios pueden gestionar fácilmente sus saldos en USD y GBP. Ofrece una interfaz intuitiva para rastrear saldos, hacer transferencias y administrar fondos en diferentes monedas."
    );
    expect(descriptionElement).toBeInTheDocument();
  });

  it("renders the button with correct label and class name", () => {
    render(
      <NextIntlClientProvider locale="en-us" messages={en}>
        <Hero />
      </NextIntlClientProvider>
    );

    const buttonElement = screen.getByText("Create a wallet");
    expect(buttonElement).toBeInTheDocument();

    const button = buttonElement.closest("button");
    expect(button).toHaveClass("self-start", "mt-4");
  });
});
