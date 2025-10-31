/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react';
import { DreamCard } from '@/components/dream/dream-card';
import { DreamSymbol } from '@/types/dream';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  );
});

const mockDream: DreamSymbol = {
  id: '1',
  slug: 'baem-snake-dream',
  name: '뱀 꿈',
  category: 'animal',
  summary: '뱀 꿈은 변화와 갱신의 신호입니다.',
  quick_answer: '뱀 꿈은 변화, 갱신, 회복의 의미로 해석됩니다.',
  body_mdx: '# 뱀 꿈 해몽\n\n뱀 꿈은 변화의 상징입니다.',
  tags: ['뱀꿈', '해몽', '변화'],
  popularity: 1250,
  polarities: {
    positive: ['변화', '갱신'],
    caution: ['위험', '배신']
  },
  modifiers: {},
  last_updated: '2024-01-15T10:00:00Z'
};

describe('DreamCard', () => {
  it('renders dream information correctly', () => {
    render(<DreamCard dream={mockDream} />);

    expect(screen.getByText('뱀 꿈')).toBeInTheDocument();
    expect(screen.getByText('뱀 꿈은 변화와 갱신의 신호입니다.')).toBeInTheDocument();
    expect(screen.getByText('animal')).toBeInTheDocument();
    expect(screen.getByText('1250')).toBeInTheDocument();
  });

  it('renders tags correctly', () => {
    render(<DreamCard dream={mockDream} />);

    expect(screen.getByText('뱀꿈')).toBeInTheDocument();
    expect(screen.getByText('해몽')).toBeInTheDocument();
    expect(screen.getByText('변화')).toBeInTheDocument();
  });

  it('contains link to dream detail page', () => {
    render(<DreamCard dream={mockDream} />);

    const link = screen.getByTestId('next-link');
    expect(link).toHaveAttribute('href', '/dream/baem-snake-dream');
  });

  it('displays popularity correctly', () => {
    render(<DreamCard dream={mockDream} />);

    expect(screen.getByText('1250')).toBeInTheDocument();
  });
});
