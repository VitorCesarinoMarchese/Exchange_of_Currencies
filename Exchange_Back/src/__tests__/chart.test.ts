import request from "supertest";
import {
  dayChart,
  weekChart,
  monthChart,
  yearChart,
} from "../utils/chartFunctions";
import { ChartApiResponse, Result } from "../@types/chart";
import createServer from "../config/server";

const { app } = createServer();

  beforeEach(() => {
    process.env.URL_REST = "http://dummyapi.com/";
    process.env.API_KEY = "dummyapikey";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe("Chart System", () => {
    describe("Chart Handler", () => {
      describe("given the currency is invalid", () => {
        it("should return a 400", async () => {
          const res = await request(app).get(`/api/chart/day/USDP`);
          expect(res.status).toBe(400);
          expect(res.body).toEqual({
            error: "Invalid param, params must be USDGBP or GBPUSD",
          });
        });
      });

      describe("given an invalid query parameter", () => {
        it("should return a 400 for missing parameter", async () => {
          const res = await request(app).get(`/api/chart/day/dadjasijdas`);
          expect(res.status).toBe(400);
        });
      });

      describe("given the result is correct", () => {
        it("should return a 200 and correct data", async () => {
          const mockData: Result = {
              base_currency: "USD",
              end_date: "2025-03-11-14:00",
              endpoint: "timeseries",
              quote_currency: "GBP",
              quotes: [{ close: 1.2, date: "2025-03-11", high: 1.3, low: 1.1, open: 1.2 }],
              request_time: "dummy",
              start_date: "2025-03-11-00:00",
            
          };
          
          global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce(mockData),
          });

          const res = await request(app).get(`/api/chart/day/USDGBP`);
          expect(res.status).toBe(200);
          expect(res.body).toEqual({result: mockData});
        });
      });
    });

    describe("dayChart", () => {
      it("should return API data on successful fetch", async () => {
        const mockData: ChartApiResponse = {
          result: {
            base_currency: "USD",
            end_date: "2025-03-11-14:30",
            endpoint: "timeseries",
            quote_currency: "GBP",
            quotes: [{ close: 1.2, date: "2025-03-11", high: 1.3, low: 1.1, open: 1.2 }],
            request_time: "dummy",
            start_date: "2025-03-01-00:00",
          },
        };
    
        global.fetch = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockData),
        });
    
        const result = await dayChart("USD");
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    
      it("should return an error when API response is not OK", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
          ok: false,
          status: 400,
        });
    
        const result = await dayChart("USD");
        expect(result).toEqual({ error: "API request failed with status 400" });
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    
      it("should return a default error when fetch fails", async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
    
        const result = await dayChart("USD");
        expect(result).toEqual({ error: "Failed to fetch day chart data" });
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });
    
    describe("weekChart", () => {
      it("should return API data on successful fetch", async () => {
        const mockData: ChartApiResponse = {
          result: {
            base_currency: "USD",
            end_date: "2025-03-11-14:30",
            endpoint: "timeseries",
            quote_currency: "GBP",
            quotes: [{ close: 1.2, date: "2025-03-11", high: 1.3, low: 1.1, open: 1.2 }],
            request_time: "dummy",
            start_date: "2025-03-01-00:00",
          },
        };
    
        global.fetch = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockData),
        });
    
        const result = await weekChart("USD");
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    
      it("should return an error when API response is not OK", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
          ok: false,
          status: 400,
        });
    
        const result = await weekChart("USD");
        expect(result).toEqual({ error: "API request failed with status 400" });
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    
      it("should return a default error when fetch fails", async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
    
        const result = await weekChart("USD");
        expect(result).toEqual({ error: "Failed to fetch week chart data" });
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });
    
    describe("monthChart", () => {
      it("should return API data on successful fetch", async () => {
        const mockData: ChartApiResponse = {
          result: {
            base_currency: "USD",
            end_date: "2025-03-11-14:30",
            endpoint: "timeseries",
            quote_currency: "GBP",
            quotes: [{ close: 1.2, date: "2025-03-11", high: 1.3, low: 1.1, open: 1.2 }],
            request_time: "dummy",
            start_date: "2025-03-01-00:00",
          },
        };
    
        global.fetch = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockData),
        });
    
        const result = await monthChart("USD");
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    
      it("should return an error when API response is not OK", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
          ok: false,
          status: 400,
        });
    
        const result = await monthChart("USD");
        expect(result).toEqual({ error: "API request failed with status 400" });
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    
      it("should return a default error when fetch fails", async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
    
        const result = await monthChart("USD");
        expect(result).toEqual({ error: "Failed to fetch month chart data" });
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });
    
    describe("yearChart", () => {
      it("should return API data on successful fetch", async () => {
        const mockData: ChartApiResponse = {
          result: {
            base_currency: "USD",
            end_date: "2025-03-11-14:30",
            endpoint: "timeseries",
            quote_currency: "GBP",
            quotes: [{ close: 1.2, date: "2025-03-11", high: 1.3, low: 1.1, open: 1.2 }],
            request_time: "dummy",
            start_date: "2025-03-01-00:00",
          },
        };
    
        global.fetch = jest.fn().mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValueOnce(mockData),
        });
    
        const result = await yearChart("USD");
        expect(result).toEqual(mockData);
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    
      it("should return an error when API response is not OK", async () => {
        global.fetch = jest.fn().mockResolvedValueOnce({
          ok: false,
          status: 400,
        });
    
        const result = await yearChart("USD");
        expect(result).toEqual({ error: "API request failed with status 400" });
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    
      it("should return a default error when fetch fails", async () => {
        global.fetch = jest.fn().mockRejectedValueOnce(new Error("Network error"));
    
        const result = await yearChart("USD");
        expect(result).toEqual({ error: "Failed to fetch year chart data" });
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });
    
  });
