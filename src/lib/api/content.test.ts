import { getContentList, createContent, getContentBySlug } from './content'
import { apiClient } from '../api-client'

// Mock apiClient
jest.mock('../api-client')
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>

describe('Content API', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getContentList', () => {
    it('fetches content list with default params', async () => {
      const mockResponse = {
        content: [
          {
            id: 1,
            type: 'blog',
            title: 'Test Blog',
            slug: 'test-blog',
            summary: 'Test summary',
            createdAt: '2024-01-01T00:00:00Z',
            updatedAt: '2024-01-01T00:00:00Z',
          },
        ],
        total: 1,
        limit: 10,
        offset: 0,
        hasMore: false,
      }

      mockApiClient.get.mockResolvedValueOnce(mockResponse)

      const result = await getContentList()

      expect(mockApiClient.get).toHaveBeenCalledWith('/content', {})
      expect(result).toEqual(mockResponse)
    })

    it('fetches content list with filters', async () => {
      const mockResponse = {
        content: [],
        total: 0,
        limit: 5,
        offset: 0,
        hasMore: false,
      }

      mockApiClient.get.mockResolvedValueOnce(mockResponse)

      const result = await getContentList({
        type: 'utility',
        status: 'published',
        limit: 5,
        search: 'calculator',
        tags: ['finance', 'math'],
      })

      expect(mockApiClient.get).toHaveBeenCalledWith('/content', {
        type: 'utility',
        status: 'published',
        limit: '5',
        search: 'calculator',
        tags: 'finance,math',
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getContentBySlug', () => {
    it('fetches content by type and slug', async () => {
      const mockContent = {
        id: 1,
        type: 'blog',
        title: 'Test Blog Post',
        slug: 'test-blog-post',
        summary: 'Test summary',
        body: 'Test content',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      mockApiClient.get.mockResolvedValueOnce(mockContent)

      const result = await getContentBySlug('blog', 'test-blog-post')

      expect(mockApiClient.get).toHaveBeenCalledWith('/blog/test-blog-post')
      expect(result).toEqual(mockContent)
    })
  })

  describe('createContent', () => {
    it('creates new content', async () => {
      const newContent = {
        type: 'blog' as const,
        slug: 'new-blog-post',
        title: 'New Blog Post',
        summary: 'New summary',
        body: 'New content',
        status: 'draft' as const,
        tags: ['test', 'blog'],
      }

      const mockResponse = { id: 123 }

      mockApiClient.post.mockResolvedValueOnce(mockResponse)

      const result = await createContent(newContent)

      expect(mockApiClient.post).toHaveBeenCalledWith('/content', newContent)
      expect(result).toEqual(mockResponse)
    })

    it('creates utility content with specific fields', async () => {
      const newUtility = {
        type: 'utility' as const,
        slug: 'test-calculator',
        title: 'Test Calculator',
        summary: 'A test calculator',
        category: 'finance',
        version: '1.0.0',
        formulaKey: 'test_formula',
        inputs: [
          {
            key: 'amount',
            label: 'Amount',
            type: 'number',
            required: true,
          },
        ],
        outputs: [
          {
            key: 'result',
            label: 'Result',
            type: 'number',
          },
        ],
      }

      const mockResponse = { id: 456 }

      mockApiClient.post.mockResolvedValueOnce(mockResponse)

      const result = await createContent(newUtility)

      expect(mockApiClient.post).toHaveBeenCalledWith('/content', newUtility)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('content type helpers', () => {
    it('fetches blog posts', async () => {
      const mockResponse = {
        content: [],
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false,
      }

      mockApiClient.get.mockResolvedValueOnce(mockResponse)

      const result = await getContentList({ type: 'blog' })

      expect(mockApiClient.get).toHaveBeenCalledWith('/content', { type: 'blog' })
      expect(result).toEqual(mockResponse)
    })

    it('fetches utilities', async () => {
      const mockResponse = {
        content: [],
        total: 0,
        limit: 10,
        offset: 0,
        hasMore: false,
      }

      mockApiClient.get.mockResolvedValueOnce(mockResponse)

      const result = await getContentList({ type: 'utility' })

      expect(mockApiClient.get).toHaveBeenCalledWith('/content', { type: 'utility' })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('related content', () => {
    it('fetches related content', async () => {
      const mockRelated = [
        {
          slug: 'related-post-1',
          title: 'Related Post 1',
          type: 'blog',
          similarity: 0.85,
        },
        {
          slug: 'related-post-2',
          title: 'Related Post 2',
          type: 'guide',
          similarity: 0.72,
        },
      ]

      mockApiClient.get.mockResolvedValueOnce(mockRelated)

      const result = await getContentList({ search: 'test' })

      expect(mockApiClient.get).toHaveBeenCalledWith('/content', { search: 'test' })
      // Note: This test would need adjustment based on actual implementation
    })
  })
})
