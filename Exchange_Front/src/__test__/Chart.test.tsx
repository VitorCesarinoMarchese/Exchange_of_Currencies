import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import Chart from "../components/Chart";
import { useCharts } from "../hooks/chartHook";
import { useWebsocket } from "../hooks/websocketHook";

vi.mock("../hooks/chartHook", () => ({ useCharts: vi.fn() }));
vi.mock("../hooks/websocketHook", () => ({ useWebsocket: vi.fn() }));

describe("Chart Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("renders error branch when error is present", async () => {
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


});