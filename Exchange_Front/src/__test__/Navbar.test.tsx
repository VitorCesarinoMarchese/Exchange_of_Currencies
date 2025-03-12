import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../components/Navbar";
import { BrowserRouter } from "react-router"; 

type NavbarProps = {
  logged: boolean;
};

const renderComponent = (props: NavbarProps) => {
  return render(
    <BrowserRouter>
      <Navbar {...props} />
    </BrowserRouter>
  );
};

describe("Navbar behavior", () => {
  describe("Navbar rendering", () => {

    it("Should render unlogged navbar", () => {
      renderComponent({ logged: false });

      const loginBtn = screen.queryByText("Login");
      const signupBtn = screen.queryByText("Signup");

      expect(loginBtn).toBeInTheDocument();
      expect(signupBtn).toBeInTheDocument();
    });

    it("Should render logged navbar", () => {
      renderComponent({ logged: true });

      const myAccountBtn = screen.queryByText("My account");
      const historyBtn = screen.queryByText("History");
      const logoutBtn = screen.queryByText("Logout");

      expect(myAccountBtn).toBeInTheDocument();
      expect(historyBtn).toBeInTheDocument();
      expect(logoutBtn).toBeInTheDocument();
    });
  });

  describe("Navbar functionality", () => {
    it("Should toggle menu visibility when clicking hamburger icon", () => {
      renderComponent({ logged: false });

      const menuButton = screen.getByRole("button", { name: /open menu/i });
      fireEvent.click(menuButton); 

      const ul = screen.queryByRole("list");

      expect(ul).not.toHaveClass("hidden");

      const closeButton = screen.queryByRole("button", { name: /close menu/i });
      if (closeButton) {
        fireEvent.click(closeButton);
        expect(ul).toHaveClass("hidden");
      } else {
        throw new Error('Close button not found');
      }
    });

    it("Should call handleLogout and remove localStorage items when clicking Logout", () => {
      renderComponent({ logged: true });

      const logoutBtn = screen.queryByText("Logout");
      if(logoutBtn)
      fireEvent.click(logoutBtn); 

      expect(localStorage.getItem("access_token")).toBeNull();
      expect(localStorage.getItem("refresh_token")).toBeNull();
      expect(localStorage.getItem("user_email")).toBeNull();
      expect(localStorage.getItem("user_id")).toBeNull();
    });
  });
});
