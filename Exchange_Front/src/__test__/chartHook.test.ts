import { renderHook, waitFor } from "@testing-library/react";
import { useCharts } from "../hooks/chartHook";
import { vi } from "vitest";
import { fetchGetApi } from "../services/apiService";

vi.mock("../services/apiService", () => ({
  fetchGetApi: vi.fn(),
}));

describe("useCharts Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should update chartData and set loading to false on successful fetch", async () => {
    const mockResponse = {
      result: {
        quotes: [
          { close: 1, date: "2022-01-01 12:34:56", high: 1, low: 1, open: 1 },
        ],
      },
    };

    (fetchGetApi as any).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useCharts("day/USDGBP"));

    await waitFor(() => {
      if (result.current.loading) throw new Error("Still loading");
      return result.current.loading === false;
    });

    expect(result.current.chartData).toEqual([
      { close: 1, x: "12:34", high: 1, low: 1, open: 1 },
    ]);
    expect(result.current.error).toBeNull();
  });

  it("should handle API errors and set an error message", async () => {
    (fetchGetApi as any).mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useCharts("day/USDGBP"));

    await waitFor(() => {
      if (result.current.loading) throw new Error("Still loading");
      return result.current.loading === false;
    });

    expect(result.current.chartData).toEqual([]);
    expect(result.current.error).toEqual(
      "Failed to load chart data. Please try again later."
    );
  });
});
