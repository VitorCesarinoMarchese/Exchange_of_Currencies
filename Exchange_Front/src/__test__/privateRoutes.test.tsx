import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { PrivateRoutes } from "../components/privateRoutes";
import { vi } from "vitest";

vi.stubGlobal("localStorage", {
  getItem: vi.fn(),
});

describe("PrivateRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Outlet when access_token is present", () => {
    localStorage.getItem.mockReturnValue("valid_token");

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/protected" element={<h1>Protected Content</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to /login when access_token is missing", async () => {
    localStorage.getItem.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/protected" element={<h1>Protected Content</h1>} />
          </Route>
          <Route path="/login" element={<h1>Login Page</h1>} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });
});
