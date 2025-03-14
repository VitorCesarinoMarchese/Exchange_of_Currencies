import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { exchangeService, addFundsService } from '../services/exchangeService';
import { fetchAuthPostApi } from '../services/apiService';

// Mocking the fetchAuthPostApi function
vi.mock('../services/apiService', () => ({
  fetchAuthPostApi: vi.fn(),
}));

// Mocking the localStorage API
beforeEach(() => {
  global.localStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  } as unknown as Storage;
});

describe('Exchange Services', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test for exchangeService function
  describe('exchangeService', () => {
    it('should return data when the API call is successful', async () => {
      const mockData = { success: true };
      const transaction = { usd: 100, gbp: 75 }; // Example transaction
      const mockResponse = { ok: true, json: vi.fn().mockResolvedValue(mockData) };

      (fetchAuthPostApi as vi.Mock).mockResolvedValue(mockResponse);
      (localStorage.getItem as vi.Mock).mockReturnValue('valid-access-token');

      const result = await exchangeService(transaction);

      expect(result).toEqual({ data: mockData, error: null, loading: false });
      expect(fetchAuthPostApi).toHaveBeenCalledWith('exchange/transaction', transaction, 'valid-access-token');
    });

    it('should return an error message if the access token is not found', async () => {
      (localStorage.getItem as vi.Mock).mockReturnValue(null); // No token in localStorage

      const transaction = { usd: 100, gbp: 75 };
      const result = await exchangeService(transaction);

      expect(result).toEqual('Unable to find accessToken');
    });

    it('should return an error message if the API call fails', async () => {
      const mockError = new Error('API Error');
      (fetchAuthPostApi as vi.Mock).mockRejectedValue(mockError);
      (localStorage.getItem as vi.Mock).mockReturnValue('valid-access-token');

      const transaction = { usd: 100, gbp: 75 };
      const result = await exchangeService(transaction);

      expect(result).toEqual({ data: null, error: 'Error trying to execute the transaction', loading: false });
    });
  });

  // Test for addFundsService function
  describe('addFundsService', () => {
    it('should return data when the API call is successful', async () => {
      const mockData = { success: true };
      const funds = { usd: 100, gbp: 75 };
      const mockResponse = { ok: true, json: vi.fn().mockResolvedValue(mockData) };
      const userId = '12345';
      (fetchAuthPostApi as vi.Mock).mockResolvedValue(mockResponse);
      (localStorage.getItem as vi.Mock).mockReturnValueOnce('valid-access-token');
      (localStorage.getItem as vi.Mock).mockReturnValueOnce(userId);

      const result = await addFundsService(funds);

      expect(result).toEqual({ data: mockData, error: null, loading: false });
      expect(fetchAuthPostApi).toHaveBeenCalledWith(`exchange/addfunds/${userId}`, funds, 'valid-access-token');
    });

    it('should return an error message if the access token or user ID is not found', async () => {
      (localStorage.getItem as vi.Mock).mockReturnValueOnce(null); // No access token in localStorage

      const funds = { usd: 100, gbp: 75 };
      const result = await addFundsService(funds);

      expect(result).toEqual('Unable to find accessToken');
    });

    it('should handle the case where API fails', async () => {
      const mockError = new Error('API Error');
      (fetchAuthPostApi as vi.Mock).mockRejectedValue(mockError);
      (localStorage.getItem as vi.Mock).mockReturnValueOnce('valid-access-token');
      (localStorage.getItem as vi.Mock).mockReturnValueOnce('12345');

      const funds = { usd: 100, gbp: 75 };
      const result = await addFundsService(funds);

      expect(result).toBeUndefined();
      expect(fetchAuthPostApi).toHaveBeenCalledWith('exchange/addfunds/12345', funds, 'valid-access-token');
    });
  });
});
