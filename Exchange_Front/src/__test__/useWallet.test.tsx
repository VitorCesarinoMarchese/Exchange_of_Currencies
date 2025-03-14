import { renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useWallet } from "../hooks/walletHook";
import { fetchAuthApi } from "../services/apiService";
import { waitFor } from "@testing-library/react";

// Mock the fetchAuthApi service
vi.mock("../services/apiService", () => ({
  fetchAuthApi: vi.fn(),
}));

describe("useWallet hook", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should fetch wallet data successfully and set loading to false", async () => {
    (fetchAuthApi as vi.Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ wallet: { usd: 100, gbp: 50 } }),
    });

    localStorage.setItem("user_id", "user123");
    localStorage.setItem("access_token", "valid_token");

    const { result } = renderHook(() => useWallet(true));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.walletData).toEqual({ usd: 100, gbp: 50 });
    expect(result.current.error).toBeNull();
  });

  it("should set error message when fetching wallet data fails", async () => {
    (fetchAuthApi as vi.Mock).mockRejectedValueOnce(new Error("Network error"));

    localStorage.setItem("user_id", "user123");
    localStorage.setItem("access_token", "valid_token");

    const { result } = renderHook(() => useWallet(true));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.walletData).toBeNull();
    expect(result.current.error).toBe("Failed to load wallet data. Please try again later.");
  });

  it("should set loading to true when fetching wallet data", async () => {
    (fetchAuthApi as vi.Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValue({ wallet: { usd: 100, gbp: 50 } }),
    });

    localStorage.setItem("user_id", "user123");
    localStorage.setItem("access_token", "valid_token");

    const { result } = renderHook(() => useWallet(true));

    expect(result.current.loading).toBe(true);
  });
});
