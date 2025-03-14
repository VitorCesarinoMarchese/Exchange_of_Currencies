import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useCharts } from '../hooks/chartHook';
import { fetchGetApi } from '../services/apiService';

vi.mock('../services/apiService', () => ({
  fetchGetApi: vi.fn(),
}));

describe('useCharts Hook', () => {
  it('should handle fetch error', async () => {
    const chartType = 'day/USDGBP';
    (fetchGetApi as vi.Mock).mockRejectedValueOnce(new Error('Failed to fetch data'));

    const { result } = renderHook(() => useCharts(chartType));

    await waitFor(() => result.current.loading === false);

    expect(result.current.chartData).toEqual([]);
    expect(result.current.error).toBe('Failed to load chart data. Please try again later.');
  });

  it('should return chart data after successful fetch', async () => {
    const chartType = 'day/USDGBP';

    (fetchGetApi as vi.Mock).mockResolvedValueOnce({
      result: {
        quotes: [
          { close: 1.3, date: '2025-03-14 12:00:00', high: 1.35, low: 1.25, open: 1.28 },
        ],
      },
    });

    const { result } = renderHook(() => useCharts(chartType));

    await waitFor(() => result.current.loading === false);

    expect(result.current.chartData).toEqual([
      {
        close: 1.3,
        x: '12:00',
        high: 1.35,
        low: 1.25,
        open: 1.28,
      },
    ]);
    expect(result.current.error).toBeNull();
  });
});
