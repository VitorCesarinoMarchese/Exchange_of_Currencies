import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Chart from "../components/Chart";
import { useCharts } from "../hooks/chartHook";
import { useWebsocket } from "../hooks/websocketHook";
import React from "react";

vi.mock("../hooks/chartHook", () => ({ useCharts: vi.fn() }));
vi.mock("../hooks/websocketHook", () => ({ useWebsocket: vi.fn() }));

describe("Chart Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  beforeAll(() => {
    // @ts-ignore
    SVGElement.prototype.getScreenCTM = vi.fn(() => ({
      // Mock the behavior to return a dummy transformation matrix
      inverse: () => ({
        scale: 1,
        translate: { x: 0, y: 0 },
      }),
    }));
  });
  
  it("renders loading branch when loading is true", async () => {
    (useCharts as any).mockReturnValue({
      chartData: [],
      loading: true,
      error: null,
    });
    (useWebsocket as any).mockReturnValue(null);
    render(<Chart />);
    await waitFor(() => {
      expect(screen.getByText("Day")).toBeInTheDocument();
    });
    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it("renders loading exchangeRates when loading is true", async () => {
    (useCharts as any).mockReturnValue({
      chartData: [],
      loading: true,
      error: null,
    });
    (useWebsocket as any).mockReturnValue(null);
    render(<Chart />);
    await waitFor(() => {
      expect(screen.getByText("Day")).toBeInTheDocument();
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it("renders exchangeRates when loading is true", async () => {
    (useCharts as any).mockReturnValue({
      chartData: [],
      loading: true,
      error: null,
    });
    (useWebsocket as any).mockReturnValue({
      GBPUSD: 1.27,
      USDGBP: 0.77,
      TS: "fake date",
    });
    render(<Chart />);
    await waitFor(() => {
      expect(screen.getByText("Day")).toBeInTheDocument();
    });
    expect(screen.getByText("GBP/USD: 1.2700")).toBeInTheDocument();
    const svgElements = document.querySelectorAll("svg");
    expect(svgElements.length).toBeGreaterThan(0);
  });

  it("renders loading exchangeRates and error branch when error is present", async () => {
    (useCharts as any).mockReturnValue({
      chartData: [],
      loading: false,
      error: "Test error",
    });
    (useWebsocket as any).mockReturnValue(null);
    render(<Chart />);
    await waitFor(() => {
      expect(screen.getByText("Error: Test error")).toBeInTheDocument();
    });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByText("Day")).toBeInTheDocument();
  });
  
  it("renders exchangeRates and error branch when error is present", async () => {
    (useCharts as any).mockReturnValue({
      chartData: [],
      loading: false,
      error: "Test error",
    });
    (useWebsocket as any).mockReturnValue({
      GBPUSD: 1.27,
      USDGBP: 0.77,
      TS: "fake date",
    });
    render(<Chart />);
    await waitFor(() => {
      expect(screen.getByText("Error: Test error")).toBeInTheDocument();
    });
    expect(screen.getByText("GBP/USD: 1.2700")).toBeInTheDocument();
    expect(screen.getByText("Day")).toBeInTheDocument();
  });

  it("renders main branch when data is available", async () => {
    (useCharts as any).mockReturnValue({
      chartData: [
        { x: new Date().toISOString(), open: 1, close: 2, high: 3, low: 0 },
      ],
      loading: false,
      error: null,
    });
    (useWebsocket as any).mockReturnValue({ GBPUSD: 1.2345, USDGBP: 0.81 });
    render(<Chart />);
    await waitFor(() => {
      expect(screen.getByText("GBP/USD: 1.2345")).toBeInTheDocument();
      expect(screen.getByText("USD/GBP: 0.8100")).toBeInTheDocument();
    });
    expect(screen.getByText("Day")).toBeInTheDocument();
  });

  it("updates chartType when filter buttons are clicked", async () => {
    (useCharts as any).mockReturnValue({
      chartData: [],
      loading: false,
      error: null,
    });
    (useWebsocket as any).mockReturnValue(null);
    render(<Chart />);
    const dayButton = screen.getByText("Day").closest("button");
    const weekButton = screen.getByText("Week").closest("button");
    expect(dayButton).toHaveClass("bg-secondary");
    expect(weekButton).toHaveClass("bg-white");
    fireEvent.click(weekButton);
    await waitFor(() => {
      expect(weekButton).toHaveClass("bg-secondary");
      expect(dayButton).toHaveClass("bg-white");
    });
  });

  it("renders chart type year", async () => {
    (useCharts as any).mockReturnValue({
      chartData: [],
      loading: false,
      error: null,
    });
    (useWebsocket as any).mockReturnValue(null);
    render(<Chart />);
    const dayButton = screen.getByText("Day").closest("button");
    const yearButton = screen.getByText("Year").closest("button");
    expect(dayButton).toHaveClass("bg-secondary");
    expect(yearButton).toHaveClass("bg-white");
    fireEvent.click(yearButton);
    await waitFor(() => {
      expect(yearButton).toHaveClass("bg-secondary");
      expect(dayButton).toHaveClass("bg-white");
    });
  });


  it('calls handleZoom on scroll while loading', () => {
    (useCharts as any).mockReturnValue({
      chartData: [],
      loading: false,
      error: null,
    });
    (useWebsocket as any).mockReturnValue(null);

    const spy = vi.spyOn(React, 'useState').mockImplementation((initialState) => [initialState, vi.fn()]);

    render(<Chart />);

    const zoomContainer = screen.getByTestId('victory-zoom-container');

    fireEvent.wheel(zoomContainer, { deltaY: -100 });

    expect(spy).toHaveBeenCalled();
  });

  it('calls handleZoom on scroll while not loading', () => {
    (useCharts as any).mockReturnValue({
      chartData: [
        { x: new Date().toISOString(), open: 1, close: 2, high: 3, low: 0 },
      ],
      loading: false,
      error: null,
    });
    (useWebsocket as any).mockReturnValue(null);

    const spy = vi.spyOn(React, 'useState').mockImplementation((initialState) => [initialState, vi.fn()]);

    render(<Chart />);

    const zoomContainer = screen.getByTestId('victory-zoom-container');

    fireEvent.wheel(zoomContainer, { deltaY: -100 });

    expect(spy).toHaveBeenCalled();
  });
});
