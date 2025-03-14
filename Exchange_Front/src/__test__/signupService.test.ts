import { vi, describe, it, expect, afterEach } from 'vitest';
import { signupService } from '../services/signupService';
import { fetchPostApi } from '../services/apiService';

// Mocking the fetchPostApi function
vi.mock('../services/apiService', () => ({
  fetchPostApi: vi.fn(),
}));

describe('signupService', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return data when signup is successful', async () => {
    const mockSignupResponse = {
      access_token: 'valid-access-token',
      user_id: '12345',
    };
    const mockResponse = { ok: true, json: vi.fn().mockResolvedValue(mockSignupResponse) };

    // Mocking the fetchPostApi to return a successful response
    (fetchPostApi as vi.Mock).mockResolvedValue(mockResponse);

    const name = 'John Doe';
    const email = 'test@example.com';
    const password = 'password123';

    const result = await signupService(name, email, password);

    expect(result).toEqual({ data: mockSignupResponse, error: null, loading: false });
    expect(fetchPostApi).toHaveBeenCalledWith('auth/register', { name, email, password });
  });

  it('should return an error message when signup fails', async () => {
    const mockError = {
        status: 400,
        json: () => "Signup failed.",
      };      // Mocking fetchPostApi to simulate an error
    (fetchPostApi as vi.Mock).mockRejectedValue(mockError);

    const name = 'John Doe';
    const email = 'test@example.com';
    const password = 'password123';

    const result = await signupService(name, email, password);

    expect(result).toEqual({ data: null, error: 'Error trying to signup', loading: false });
    expect(fetchPostApi).toHaveBeenCalledWith('auth/register', { name, email, password });
  });

  it('should handle response failure with non-200 status codes', async () => {
    const mockResponse = { ok: false, json: vi.fn().mockResolvedValue({}) };
    // Mocking the fetchPostApi to simulate a failed response
    (fetchPostApi as vi.Mock).mockResolvedValue(mockResponse);

    const name = 'John Doe';
    const email = 'test@example.com';
    const password = 'password123';

    const result = await signupService(name, email, password);

    expect(result).toEqual({ data: null, error: 'Error trying to signup', loading: false });
    expect(fetchPostApi).toHaveBeenCalledWith('auth/register', { name, email, password });
  });
});
