import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loginService } from '../services/loginService';
import { fetchPostApi } from '../services/apiService';

// Mocking the fetchPostApi function
vi.mock('../services/apiService', () => ({
  fetchPostApi: vi.fn(),
}));

describe('loginService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return data when login is successful', async () => {
    const mockLoginResponse = {
      access_token: 'valid-access-token',
      user_id: '12345',
    };
    const mockResponse = { ok: true, json: vi.fn().mockResolvedValue(mockLoginResponse) };

    // Mocking the fetchPostApi to return a successful response
    (fetchPostApi as vi.Mock).mockResolvedValue(mockResponse);

    const email = 'test@example.com';
    const password = 'password123';

    const result = await loginService(email, password);

    expect(result).toEqual({ data: mockLoginResponse, error: null, loading: false });
    expect(fetchPostApi).toHaveBeenCalledWith('auth/login', { email, password });
  });

  it('should return an error message when login fails', async () => {
    const mockError = {
      status: 400,
      json: () => "Login failed.",
    };    // Mocking fetchPostApi to simulate an error
    (fetchPostApi as vi.Mock).mockRejectedValue(mockError);

    const email = 'test@example.com';
    const password = 'password123';

    const result = await loginService(email, password);

    expect(result).toEqual({ data: null, error: 'Error trying to login', loading: false });
    expect(fetchPostApi).toHaveBeenCalledWith('auth/login', { email, password });
  });

  it('should handle response failure with non-200 status codes', async () => {
    const mockResponse = { ok: false, json: vi.fn().mockResolvedValue({}) };
    // Mocking the fetchPostApi to simulate a failed response
    (fetchPostApi as vi.Mock).mockResolvedValue(mockResponse);

    const email = 'test@example.com';
    const password = 'password123';

    const result = await loginService(email, password);

    expect(result).toEqual({ data: null, error: 'Error trying to login', loading: false });
    expect(fetchPostApi).toHaveBeenCalledWith('auth/login', { email, password });
  });
});
