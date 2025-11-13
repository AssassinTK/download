import { render, screen, fireEvent } from '@testing-library/react';
import { LearningMap } from '@components/LearningMap';
import { LearningPathAnalyzer } from '@utils/learning/analyzer';
import '@testing-library/jest-dom';

describe('LearningMap Component', () => {
  let analyzer: LearningPathAnalyzer;

  beforeEach(() => {
    analyzer = new LearningPathAnalyzer();
  });

  test('renders learning paths correctly', () => {
    const mockPaths = [
      {
        id: '1',
        title: '基礎程式設計',
        nodes: [
          { id: '1-1', title: 'Python 基礎' },
          { id: '1-2', title: '變數與資料類型' }
        ],
        difficulty: 1
      }
    ];

    render(<LearningMap paths={mockPaths} />);
    
    expect(screen.getByText('基礎程式設計')).toBeInTheDocument();
    expect(screen.getByText('Python 基礎')).toBeInTheDocument();
  });

  test('handles node selection', () => {
    const mockOnSelect = jest.fn();
    const mockPaths = [
      {
        id: '1',
        title: '基礎程式設計',
        nodes: [{ id: '1-1', title: 'Python 基礎' }]
      }
    ];

    render(<LearningMap paths={mockPaths} onNodeSelect={mockOnSelect} />);
    
    const node = screen.getByText('Python 基礎');
    fireEvent.click(node);
    
    expect(mockOnSelect).toHaveBeenCalledWith('1-1');
  });

  test('calculates path difficulty', async () => {
    const mockPath = {
      nodes: [{ id: '1', title: 'Test Node' }],
      estimatedTime: 120,
      difficulty: 3,
      prerequisites: ['basic-math'],
      skills: ['problem-solving'],
      completionRate: 0.75,
      userRating: 4.5,
      popularity: 0.8,
      interactivity: 0.6,
      resourceCount: 5
    };

    await analyzer.initModel();
    const difficulty = await analyzer.predictPathDifficulty(mockPath);
    
    expect(difficulty).toBeDefined();
    expect(typeof difficulty).toBe('number');
    expect(difficulty).toBeGreaterThanOrEqual(0);
    expect(difficulty).toBeLessThanOrEqual(1);
  });
});