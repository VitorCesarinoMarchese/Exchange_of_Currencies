import { renderHook, waitFor } from "@testing-library/react";
import { useHistory } from "../hooks/historyHook";
import { vi } from "vitest";
import { fetchAuthApi } from "../services/apiService";

// Mock API service
vi.mock("../services/apiService", () => ({
  fetchAuthApi: vi.fn(),
}));

describe("useHistory Hook", () => {
    beforeEach(() => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn((key) => {
          if (key === "user_id") return "user123"; 
          if (key === "access_token") return "valid_token"; 
          return null;
        }),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      });
    });
  
    afterEach(() => {
      vi.restoreAllMocks();
    });
  
    it("should return error if user is not authenticated", async () => {
      vi.stubGlobal("localStorage", {
        getItem: vi.fn((key) => (key === "userId" ? null : null)), 
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      });
  
      const { result } = renderHook(() => useHistory(true));
  
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe("User is not authenticated.");
        expect(result.current.history).toEqual([]);
      });
  
      expect(fetchAuthApi).not.toHaveBeenCalled();
    });
  
    it("should call fetchAuthApi and update history on success", async () => {
      const mockResponse = {
        status: 200,
        json: async () => ({
          recentTransactions: [{ id: 1, amount: 100, date: "2025-03-12" }],
        }),
      };
  
      fetchAuthApi.mockResolvedValueOnce(mockResponse);
  
      const { result } = renderHook(() => useHistory(true));
  
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.history).toEqual([
          { id: 1, amount: 100, date: "2025-03-12" },
        ]);
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
  
      fetchAuthApi.mockResolvedValueOnce(mockResponse);
  
      const { result } = renderHook(() => useHistory(true));
  
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe("Failed to load transaction history.");
        expect(result.current.history).toEqual([]);
      });
    });
  
    it("should handle exceptions thrown by the API and set error state", async () => {
        fetchAuthApi.mockRejectedValueOnce(new Error("Network Error"));
    
        const { result } = renderHook(() => useHistory(true));
    
        await waitFor(() => {
          expect(result.current.loading).toBe(false);
          expect(result.current.error).toBe("Failed to load transaction history.");
          expect(result.current.history).toEqual([]); 
        });
      });
  });
  