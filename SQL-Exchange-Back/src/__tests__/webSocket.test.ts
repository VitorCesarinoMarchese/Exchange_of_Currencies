import { EventEmitter } from "events";

class FakeWebSocket extends EventEmitter {
  public sentMessages: string[] = [];
  public url: string;
  static instances: FakeWebSocket[] = [];
  
  constructor(url: string) {
    super();
    this.url = url;
    FakeWebSocket.instances.push(this);
  }
  
  send(message: string) {
    this.sentMessages.push(message);
  }
  
  close() {
    this.emit("close");
  }
}

jest.mock("ws", () => {
  return {
    __esModule: true,
    default: FakeWebSocket,
  };
});

afterAll(() => {
  jest.clearAllMocks()
})

describe("WebSocket Module", () => {
  beforeEach(() => {
    jest.resetModules();
    FakeWebSocket.instances = [];
    process.env.URL_WEBSOCKET = "ws://dummy-url";
    process.env.API_KEY_WEBSOCKET = "dummyKey";
  });

  test("should send subscription message on open event", () => {
    const wsModule = require("../utils/webSocket");
    const wsInstance = FakeWebSocket.instances[0];
    wsInstance.emit("open");
    expect(wsInstance.sentMessages).toContain(
      `{"userKey":"dummyKey", "symbol":"GBPUSD"}`
    );
  });

  test("should update exchangeRates on valid message event", () => {
    const wsModule = require("../utils/webSocket");
    const wsInstance = FakeWebSocket.instances[0];
    const validMessage = JSON.stringify({ ask: 1.3, ts: "1234567890" });
    wsInstance.emit("message", validMessage);
    const rates = wsModule.getExchangeRates();
    expect(rates.GBPUSD).toBe(1.3);
    expect(rates.USDGBP).toBeCloseTo(1 / 1.3);
    expect(rates.TS).toBe("1234567890");
  });

  test("should not update exchangeRates on 'Connected' message", () => {
    const wsModule = require("../utils/webSocket");
    const wsInstance = FakeWebSocket.instances[0];
    const initialRates = wsModule.getExchangeRates();
    wsInstance.emit("message", "Connected");
    const rates = wsModule.getExchangeRates();
    expect(rates).toEqual(initialRates);
  });

  test("should log error on invalid JSON message", () => {
    const wsModule = require("../utils/webSocket");
    const wsInstance = FakeWebSocket.instances[0];
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    wsInstance.emit("message", "invalid json");
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  test("addSubscriber should add a WebSocket without throwing", () => {
    const wsModule = require("../utils/webSocket");
    const dummyWS = new FakeWebSocket("ws://dummy-subscriber");
    expect(() => {
      wsModule.addSubscriber(dummyWS);
    }).not.toThrow();
  });

  test("should reconnect on close event", () => {
    jest.useFakeTimers();
    const wsModule = require("../utils/webSocket");
    const initialInstancesCount = FakeWebSocket.instances.length;
    const wsInstance = FakeWebSocket.instances[0];
    wsInstance.emit("close");
    jest.advanceTimersByTime(10000);
    expect(FakeWebSocket.instances.length).toBeGreaterThan(initialInstancesCount);
    jest.useRealTimers();
  });
});
