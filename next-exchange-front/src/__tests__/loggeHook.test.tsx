import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useLogged } from "../hooks/loggedHook";
import { fetchAuthApi, fetchPostApi } from "../services/apiService";

vi.mock("../services/apiService", () => ({
  fetchAuthApi: vi.fn(),
  fetchPostApi: vi.fn(),
}));

describe("useLogged hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should set logged to true when access token is valid", async () => {
    localStorage.setItem("access_token", "valid_token");

    (fetchAuthApi as vi.Mock).mockResolvedValue({ status: 200 });

    const { result} = renderHook(() => useLogged());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.logged).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should set logged to false and return error when no access token is found", async () => {
    localStorage.removeItem("access_token");

    const { result} = renderHook(() => useLogged());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.logged).toBe(false);
    expect(result.current.error).toBe("User doesn't have an access token");
  });

  it("should attempt to refresh token and set logged to true if access token is expired", async () => {
    localStorage.setItem("access_token", "expired_token");
    localStorage.setItem("refresh_token", "valid_refresh_token");

    (fetchAuthApi as vi.Mock).mockResolvedValueOnce({ status: 403 });

    (fetchPostApi as vi.Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ accessToken: "new_valid_token" }),
    });

    (fetchAuthApi as vi.Mock).mockResolvedValueOnce({ status: 200 });

    const { result} = renderHook(() => useLogged());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.logged).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should set logged to false and return error when token refresh fails", async () => {
    localStorage.setItem("access_token", "expired_token");
    localStorage.setItem("refresh_token", "valid_refresh_token");

    (fetchAuthApi as vi.Mock).mockResolvedValueOnce({ status: 403 });

    (fetchPostApi as vi.Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ accessToken: null }),
    });

    const { result } = renderHook(() => useLogged());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.logged).toBe(false);
    expect(result.current.error).toBe("Authentication failed.");
  });

  it("should set logged to false and return error when no refresh token is available", async () => {
    localStorage.setItem("access_token", "expired_token");
    localStorage.removeItem("refresh_token");

    (fetchAuthApi as vi.Mock).mockResolvedValueOnce({ status: 403 });

    const { result} = renderHook(() => useLogged());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.logged).toBe(false);
    expect(result.current.error).toBe("Authentication failed.");
  });
});
