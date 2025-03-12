// __tests__/useConvert.test.tsx

import { renderHook, waitFor } from "@testing-library/react";
import { useConvert } from "../hooks/convetHook";
import { vi } from "vitest";
import { fetchPostApi } from "../services/apiService";

// Mock the fetchPostApi function
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

    // Since the hook returns early, the states remain at their initial values
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

  // it("should update data and set loading to false on successful conversion", async () => {
  //   const mockResponse = {
  //     status: 200,
  //     json: async () => ({ result: { total: "120", rate: 1.2 } }),
  //   };
  //   (fetchPostApi as any).mockResolvedValueOnce(mockResponse);

  //   const { result } = renderHook(() =>
  //     useConvert({ from: "USD", to: "EUR", amount: "100" })
  //   );

  //   await waitFor(() => {
  //     if (result.current.loading) throw new Error("Still loading");
  //     return result.current.loading === false;
  //   });
  //   console.log(`${result}`)
  //   console.log()
  //   expect(fetchPostApi).toHaveBeenCalledWith("conversion", {
  //     from: "USD",
  //     to: "EUR",
  //     amount: "100",
  //   });
  //   expect(result.current.data).toEqual({ result: { total: "120", rate: 1.2 } });
  //   expect(result.current.error).toBeNull();
  // });

  it("should handle API error response and set error state", async () => {
    const mockResponse = {
      status: 400,
      json: async () => ({ error: "Conversion failed." }),
    };
    (fetchPostApi as any).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() =>
      useConvert({ from: "USD", to: "EUR", amount: "100" })
    );
    console.log(result)

    await waitFor(() => {
      if (result.current.loading) throw new Error("Still loading");
      return result.current.loading === false;
    });

    expect(result.current.error).toEqual({ error: "Conversion failed." });
    expect(result.current.data).toBeNull();
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

    expect(result.current.error).toEqual({ error: "Conversion failed." });
    expect(result.current.data).toBeNull();
  });
});
