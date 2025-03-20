import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { useWebsocket } from "../hooks/websocketHook";

global.WebSocket = vi.fn().mockImplementation(() => ({
  onopen: vi.fn(),
  onmessage: vi.fn(),
  onclose: vi.fn(),
  send: vi.fn(),
  close: vi.fn(),
}));

describe("useWebsocket hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should connect to WebSocket server and set exchange rates on message", async () => {
    const mockData = JSON.stringify({
      GBPUSD: 1.2,
      USDGBP: 0.9,
      TS: "2025-03-13T12:00:00Z",
    });

    const mockSocket = {
      onmessage: vi.fn(),
      onopen: vi.fn(),
      onclose: vi.fn(),
      send: vi.fn(),
      close: vi.fn(),
    };

    global.WebSocket = vi.fn(() => mockSocket) as any;

    const { result } = renderHook(() => useWebsocket());

    mockSocket.onmessage({ data: mockData });

    await waitFor(() =>
      expect(result.current).toEqual({
        GBPUSD: 1.2,
        USDGBP: 0.9,
        TS: "2025-03-13T12:00:00Z",
      })
    );
  });

  it("should handle invalid data gracefully", async () => {
    const { result } = renderHook(() => useWebsocket());

    const mockSocket = new WebSocket("ws://localhost:3031");

    mockSocket.onmessage({ data: "invalid_data" });

    await waitFor(() => expect(result.current).toBeNull());

    expect(result.current).toBeNull();
  });

  it("should close WebSocket connection when the component is unmounted", () => {
    const mockSocket = {
      close: vi.fn(),
      onopen: vi.fn(),
      onmessage: vi.fn(),
      onclose: vi.fn(),
      send: vi.fn(),
    };

    global.WebSocket = vi.fn(() => mockSocket) as any;

    const { unmount } = renderHook(() => useWebsocket());

    unmount();

    expect(mockSocket.close).toHaveBeenCalled();
  });

  it("should connect to WebSocket server and console.log it", async () => {
    const mockData = JSON.stringify({
      GBPUSD: 1.2,
      USDGBP: 0.9,
      TS: "2025-03-13T12:00:00Z",
    });

    const mockSocket = {
      onmessage: vi.fn(),
      onopen: vi.fn(),
      onclose: vi.fn(),
      send: vi.fn(),
      close: vi.fn(),
    };

    const logMock = vi.fn();
    console.log = logMock;

    global.WebSocket = vi.fn(() => mockSocket) as any;

    const { result } = renderHook(() => useWebsocket());

    mockSocket.onopen();
    mockSocket.onmessage({ data: mockData });

    await waitFor(() => {
      expect(result.current).toEqual({
        GBPUSD: 1.2,
        USDGBP: 0.9,
        TS: "2025-03-13T12:00:00Z",
      });
      expect(logMock).toHaveBeenCalled();
    });
  });
});
