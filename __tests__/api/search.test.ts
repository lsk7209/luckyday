/**
 * @jest-environment node
 */
import { GET } from '@/app/api/search/route';
import { NextRequest } from 'next/server';

// Mock Supabase client
jest.mock('@/lib/supabase-client', () => ({
  dreamDb: {
    getDreamSymbols: jest.fn(),
    logSearch: jest.fn(),
  },
}));

const { dreamDb } = require('@/lib/supabase-client');

describe('/api/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 400 when query parameter is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/search');
    const response = await GET(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Query parameter "q" is required');
  });

  it('returns search results for valid query', async () => {
    const mockResults = [
      {
        id: '1',
        slug: 'baem-snake-dream',
        name: '뱀 꿈',
        category: 'animal',
        summary: '뱀 꿈은 변화의 상징',
        popularity: 100,
      },
    ];

    dreamDb.getDreamSymbols.mockResolvedValue(mockResults);
    dreamDb.logSearch.mockResolvedValue();

    const request = new NextRequest('http://localhost:3000/api/search?q=뱀');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toEqual(mockResults);
    expect(dreamDb.getDreamSymbols).toHaveBeenCalledWith({
      search: '뱀',
      limit: 10,
    });
    expect(dreamDb.logSearch).toHaveBeenCalledWith('뱀', undefined);
  });

  it('respects limit parameter', async () => {
    dreamDb.getDreamSymbols.mockResolvedValue([]);
    dreamDb.logSearch.mockResolvedValue();

    const request = new NextRequest('http://localhost:3000/api/search?q=test&limit=5');
    await GET(request);

    expect(dreamDb.getDreamSymbols).toHaveBeenCalledWith({
      search: 'test',
      limit: 5,
    });
  });

  it('logs search with user agent', async () => {
    dreamDb.getDreamSymbols.mockResolvedValue([]);
    dreamDb.logSearch.mockResolvedValue();

    const request = new NextRequest('http://localhost:3000/api/search?q=test');
    // Mock user agent
    Object.defineProperty(request, 'headers', {
      value: {
        get: jest.fn().mockReturnValue('Mozilla/5.0 Test Browser'),
      },
    });

    await GET(request);

    expect(dreamDb.logSearch).toHaveBeenCalledWith('test', 'Mozilla/5.0 Test Browser');
  });

  it('handles database errors gracefully', async () => {
    dreamDb.getDreamSymbols.mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/search?q=test');
    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch search results');
  });
});
