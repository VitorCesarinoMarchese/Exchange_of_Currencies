import { renderHook, waitFor } from "@testing-library/react";
import { useConvert } from "../hooks/convetHook";
import { vi } from "vitest";
import { fetchPostApi } from "../services/apiService";

vi.mock("../services/apiService", () => ({
  fetchPostApi: vi.fn(),
}));

describe("useConvert Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not call fetchPostApi if amount is empty", async () => {
    const { result } = renderHook(() =>
      useConvert({ from: "USD", to: "EUR", amount: "" })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(fetchPostApi).not.toHaveBeenCalled();
  });

  it("should not call fetchPostApi if amount is zero", async () => {
    const { result } = renderHook(() =>
      useConvert({ from: "USD", to: "EUR", amount: "0" })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(fetchPostApi).not.toHaveBeenCalled();
  });

  it("should not call fetchPostApi if amount is negative", async () => {
    const { result } = renderHook(() =>
      useConvert({ from: "USD", to: "EUR", amount: "-10" })
    );

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(fetchPostApi).not.toHaveBeenCalled();
  });

  it("should handle API error response and set error state", async () => {
    const mockResponse = {
      status: 400,
      json: () => "Conversion failed.",
    };
    fetchPostApi.mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useConvert({ from: "USD", to: "EUR", amount: "100" })
    );

    await waitFor(() => {
      if (result.current.loading) throw new Error("Still loading");
      return result.current.loading === false;
    });

    expect(result.current.error).toEqual("Conversion failed.");
  });

  it("should handle exceptions thrown by the API and set error state", async () => {
    (fetchPostApi as any).mockRejectedValueOnce(new Error("Network Error"));

    const { result } = renderHook(() =>
      useConvert({ from: "USD", to: "EUR", amount: "100" })
    );

    await waitFor(() => {
      if (result.current.loading) throw new Error("Still loading");
      return result.current.loading === false;
    });

    expect(result.current.error).toEqual("Conversion failed.");
  });

  it("should handle API response and set data state", async () => {
    const mockResponse = {
      status: 200,
      json: () => ({
        result: {
          total: 77.36,
          rate: 0.773586657177337,
        },
      }),
    };
    fetchPostApi.mockResolvedValue(mockResponse);

    const { result } = renderHook(() =>
      useConvert({ from: "USD", to: "EUR", amount: "100" })
    );

    await waitFor(() => {
      if (result.current.loading) throw new Error("Still loading");
      return result.current.loading === false;
    });

    expect(result.current.data).toEqual({
      result: {
        total: 77.36,
        rate: 0.773586657177337,
      },
    });
  });
});
