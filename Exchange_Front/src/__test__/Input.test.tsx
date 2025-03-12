import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from 'vitest';
import "@testing-library/jest-dom";
import Input from "../components/Input";

describe("Input component", () => {
  it("renders input with correct placeholder and type", () => {
    render(<Input type="text" placeholder="Enter your name" />);

    const input = screen.getByPlaceholderText("Enter your name");

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("triggers change event when input value changes", () => {
    const handleChange = vi.fn();
    render(<Input type="text" placeholder="Enter your name" change={handleChange} />);

    const input = screen.getByPlaceholderText("Enter your name");

    fireEvent.change(input, { target: { value: "John" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should be read-only if read prop is true", () => {
    render(<Input type="text" placeholder="Enter your name" read={true} />);

    const input = screen.getByPlaceholderText("Enter your name");

    expect(input).toHaveAttribute("readonly");
  });

  it("applies custom class and width", () => {
    render(<Input type="text" placeholder="Enter your name" className="text-gray-600" w="w-96" />);

    const input = screen.getByPlaceholderText("Enter your name");

    expect(input).toHaveClass("text-gray-600");
    expect(input).toHaveClass("w-96");
  });
});
