// __tests__/useHistory.test.tsx

import { renderHook, waitFor } from "@testing-library/react";
import { useHistory } from "../hooks/historyHook";
import { vi } from "vitest";
import { fetchAuthApi } from "../services/apiService";

vi.mock("../services/apiService", () => ({
  fetchAuthApi: vi.fn(),
}));

describe("useHistory Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return error if user is not authenticated", async () => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValueOnce(null).mockReturnValueOnce(null),
    });

    const { result } = renderHook(() => useHistory(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("User is not authenticated.");
      expect(result.current.history).toEqual([]);
    });
  });

  it("should call fetchAuthApi and update history on success", async () => {
    const mockResponse = {
      recentTransactions: [{ id: 1, amount: 100, date: "2025-03-12" }],
    };
    (fetchAuthApi as any).mockResolvedValueOnce({
      json: async () => mockResponse,
    });

    vi.stubGlobal("localStorage", {
      getItem: vi.fn()
        .mockReturnValueOnce("user123")  
        .mockReturnValueOnce("valid_token"), 
    });

    const { result } = renderHook(() => useHistory(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.history).toEqual(mockResponse.recentTransactions);
    });

    expect(fetchAuthApi).toHaveBeenCalledWith(
      "exchange/transaction_history/user123",
      "valid_token"
    );
  });

  it("should handle API error response and set error state", async () => {
    const mockResponse = {
      status: 400,
      json: async () => ({ error: "Failed to load transaction history." }),
    };
    (fetchAuthApi as any).mockResolvedValueOnce(mockResponse);

    // Mock localStorage.getItem to return valid userId and accessToken
    vi.stubGlobal("localStorage", {
      getItem: vi.fn()
        .mockReturnValueOnce("user123")  // user_id
        .mockReturnValueOnce("valid_token"), // access_token
    });

    const { result } = renderHook(() => useHistory(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Failed to load wallet data. Please try again later.");
      expect(result.current.history).toEqual([]);
    });
  });

  it("should handle exceptions thrown by the API and set error state", async () => {
    (fetchAuthApi as any).mockRejectedValueOnce(new Error("Network Error"));

    // Mock localStorage.getItem to return valid userId and accessToken
    vi.stubGlobal("localStorage", {
      getItem: vi.fn()
        .mockReturnValueOnce("user123")  // user_id
        .mockReturnValueOnce("valid_token"), // access_token
    });

    const { result } = renderHook(() => useHistory(true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe("Failed to load wallet data. Please try again later.");
      expect(result.current.history).toEqual([]);
    });
  });
});
