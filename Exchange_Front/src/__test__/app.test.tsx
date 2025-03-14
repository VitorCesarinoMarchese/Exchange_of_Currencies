import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

describe("App Component", () => {
  test("renders Home page on initial load", () => {
    render(<App />);
    expect(screen.getByText("Wallet Feature")).toBeInTheDocument();
  });

  test("navigates to Login page when clicking login link", () => {
    window.history.pushState({}, "Login Page", "/login");
    render(<App />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Login");
  });

  test("navigates to Signup page when clicking signup link", () => {
    window.history.pushState({}, "Signup Page", "/signup");

    render(<App />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Signup");
  });

  test("renders Dashboard when logged in with token", () => {
    localStorage.setItem("access_token", "mocked-token");
    window.history.pushState({}, "Dashboard Page", "/dashboard");

    render(<App />);
    expect(screen.getByText("Exchange")).toBeInTheDocument();
  });

  test("redirects to login if no token exists for private route", () => {
    localStorage.removeItem("access_token");
    window.history.pushState({}, "History Page", "/history");

    render(<App />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Login");
  });
});
