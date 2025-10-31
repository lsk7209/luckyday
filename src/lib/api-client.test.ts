import { apiClient, ApiError } from './api-client'

// Mock fetch globally
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET requests', () => {
    it('makes successful GET request', async () => {
      const mockResponse = {
        success: true,
        data: { message: 'Hello World' },
        timestamp: new Date().toISOString(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await apiClient.get('/test')

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8787/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      expect(result).toEqual({ message: 'Hello World' })
    })

    it('makes GET request with query parameters', async () => {
      const mockResponse = {
        success: true,
        data: [],
        timestamp: new Date().toISOString(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      await apiClient.get('/search', { q: 'test', limit: 10 })

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8787/search?q=test&limit=10',
        expect.any(Object)
      )
    })

    it('includes authorization header when token exists', async () => {
      ;(global.localStorage.getItem as jest.Mock).mockReturnValueOnce('test-token')

      const mockResponse = {
        success: true,
        data: {},
        timestamp: new Date().toISOString(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      await apiClient.get('/protected')

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8787/protected',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      )
    })
  })

  describe('POST requests', () => {
    it('makes successful POST request with data', async () => {
      const mockResponse = {
        success: true,
        data: { id: 1 },
        timestamp: new Date().toISOString(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await apiClient.post('/items', { name: 'Test Item' })

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8787/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Test Item' }),
      })
      expect(result).toEqual({ id: 1 })
    })
  })

  describe('error handling', () => {
    it('throws ApiError on HTTP error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({
          success: false,
          error: {
            message: 'Not found',
            code: 'NOT_FOUND',
          },
          timestamp: new Date().toISOString(),
        }),
      } as Response)

      await expect(apiClient.get('/not-found')).rejects.toThrow('Not found')
    })

    it('handles successful error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: false,
          error: {
            message: 'Not found',
            code: 'NOT_FOUND',
          },
          timestamp: new Date().toISOString(),
        }),
      } as Response)

      await expect(apiClient.get('/not-found')).rejects.toThrow('Not found')
    })

    it('throws ApiError on network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(apiClient.get('/test')).rejects.toThrow(ApiError)
      await expect(apiClient.get('/test')).rejects.toThrow('Network error occurred')
    })

    it('throws ApiError when response success is false', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
          },
          timestamp: new Date().toISOString(),
        }),
      } as Response)

      await expect(apiClient.post('/items', {})).rejects.toThrow('Validation failed')
    })
  })

  describe('PUT and PATCH requests', () => {
    it('makes PUT request', async () => {
      const mockResponse = {
        success: true,
        data: { updated: true },
        timestamp: new Date().toISOString(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await apiClient.put('/items/1', { name: 'Updated' })

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8787/items/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Updated' }),
      })
      expect(result).toEqual({ updated: true })
    })

    it('makes PATCH request', async () => {
      const mockResponse = {
        success: true,
        data: { patched: true },
        timestamp: new Date().toISOString(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await apiClient.patch('/items/1', { status: 'active' })

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8787/items/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'active' }),
      })
      expect(result).toEqual({ patched: true })
    })
  })

  describe('DELETE requests', () => {
    it('makes DELETE request', async () => {
      const mockResponse = {
        success: true,
        data: { deleted: true },
        timestamp: new Date().toISOString(),
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response)

      const result = await apiClient.delete('/items/1')

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8787/items/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      expect(result).toEqual({ deleted: true })
    })
  })
})
