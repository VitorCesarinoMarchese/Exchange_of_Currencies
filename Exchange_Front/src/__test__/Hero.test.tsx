import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Hero from "../components/Hero";

describe("Hero Component", () => {
  it("renders the title and description text", () => {
    render(<Hero />);

    const titleElement = screen.getByText("Wallet Feature");
    expect(titleElement).toBeInTheDocument();

    const descriptionElement = screen.getByText(
      "With the wallet feature, users can easily manage their balances in USD and GBP. It offers an easy-to-use interface for tracking balances, making transfers, and managing funds across different currencies."
    );
    expect(descriptionElement).toBeInTheDocument();
  });

  it("renders the button with correct label and class name", () => {
    render(<Hero />);

    const buttonElement = screen.getByText("Create a wallet");
    expect(buttonElement).toBeInTheDocument();

    const button = buttonElement.closest("button");
    expect(button).toHaveClass("self-start", "mt-4");
  });
});
