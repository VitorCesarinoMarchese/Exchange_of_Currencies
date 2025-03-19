import { vi, describe, it, expect, beforeEach } from 'vitest';
import { fetchGetApi, fetchAuthApi, fetchAuthPostApi, fetchPostApi } from '../services/apiService';

global.fetch = vi.fn();  

describe('API Service Functions', () => {
  
  beforeEach(() => {
    vi.clearAllMocks(); 
  });

  describe('fetchGetApi', () => {
    it('should return data when the fetch is successful', async () => {
      const mockData = { data: 'test' };
      (fetch as vi.Mock).mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockData),
      });

      const result = await fetchGetApi('test-endpoint');
      expect(result).toEqual(mockData);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3030/api/test-endpoint');
    });

    it('should throw an error when the fetch fails', async () => {
      (fetch as vi.Mock).mockResolvedValueOnce({
        ok: false,
        json: vi.fn(),
      });

      await expect(fetchGetApi('test-endpoint')).rejects.toThrow('Error fetching api');
    });

    it('should catch and throw an error if fetch throws an exception', async () => {
      (fetch as vi.Mock).mockRejectedValueOnce(new Error('Network Error'));

      await expect(fetchGetApi('test-endpoint')).rejects.toThrow('Network Error');
    });
  });

  // Test for fetchAuthApi
  describe('fetchAuthApi', () => {
    it('should return response when the fetch is successful', async () => {
      const mockResponse = { status: 200 };
      (fetch as vi.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const token = 'valid-token';
      const result = await fetchAuthApi('test-endpoint', token);
      expect(result.status).toBe(200);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3030/api/test-endpoint', {
        method: 'GET',
        headers: { Authorization: 'valid-token' },
      });
    });

    it('should log and not throw an error when the response is not ok', async () => {
      (fetch as vi.Mock).mockResolvedValueOnce({
        ok: false,
        json: vi.fn(),
      });

      const token = 'valid-token';
      await fetchAuthApi('test-endpoint', token);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3030/api/test-endpoint', {
        method: 'GET',
        headers: { Authorization: 'valid-token' },
      });
    });

    it('should catch and throw an error if fetch throws an exception', async () => {
      (fetch as vi.Mock).mockRejectedValueOnce(new Error('Network Error'));

      const token = 'valid-token';
      await expect(fetchAuthApi('test-endpoint', token)).rejects.toThrow('Network Error');
    });
  });

  // Test for fetchAuthPostApi
  describe('fetchAuthPostApi', () => {
    it('should return response when the fetch is successful', async () => {
      const mockResponse = { status: 200 };
      (fetch as vi.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const token = 'valid-token';
      const body = { data: 'test' };
      const result = await fetchAuthPostApi('test-endpoint', body, token);
      expect(result.status).toBe(200);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3030/api/test-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'valid-token' },
        body: JSON.stringify(body),
      });
    });

    it('should throw an error when the fetch fails', async () => {
      (fetch as vi.Mock).mockResolvedValueOnce({
        ok: false,
        json: vi.fn(),
      });

      const token = 'valid-token';
      const body = { data: 'test' };
      await expect(fetchAuthPostApi('test-endpoint', body, token)).rejects.toThrow('Error fetching api');
    });

    it('should catch and throw an error if fetch throws an exception', async () => {
      (fetch as vi.Mock).mockRejectedValueOnce(new Error('Network Error'));

      const token = 'valid-token';
      const body = { data: 'test' };
      await expect(fetchAuthPostApi('test-endpoint', body, token)).rejects.toThrow('Network Error');
    });
  });

  // Test for fetchPostApi
  describe('fetchPostApi', () => {
    it('should return response when the fetch is successful', async () => {
      const mockResponse = { status: 200 };
      (fetch as vi.Mock).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValueOnce(mockResponse),
      });

      const body = { data: 'test' };
      const result = await fetchPostApi('test-endpoint', body);
      expect(result.status).toBe(200);
      expect(fetch).toHaveBeenCalledWith('http://localhost:3030/api/test-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    });

    it('should throw an error when the fetch fails', async () => {
      (fetch as vi.Mock).mockResolvedValueOnce({
        ok: false,
        json: vi.fn(),
      });

      const body = { data: 'test' };
      await expect(fetchPostApi('test-endpoint', body)).rejects.toThrow('Error fetching api');
    });

    it('should catch and throw an error if fetch throws an exception', async () => {
      (fetch as vi.Mock).mockRejectedValueOnce(new Error('Network Error'));

      const body = { data: 'test' };
      await expect(fetchPostApi('test-endpoint', body)).rejects.toThrow('Network Error');
    });
  });
});
