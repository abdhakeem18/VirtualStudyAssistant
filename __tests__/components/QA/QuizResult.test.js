import React from 'react';
import { render } from '@testing-library/react-native';
import QuizResult from '../../../screens/components/QA/QuizResult';

describe('QuizResult Component', () => {
  const defaultProps = {
    score: 80,
    totalQuestions: 10,
    correctAnswers: 8,
    streak: 5,
    bestScore: 90,
  };

  it('should render score percentage', () => {
    const { getByText } = render(<QuizResult {...defaultProps} />);
    expect(getByText(/80%/i)).toBeTruthy();
  });

  it('should render correct answers count', () => {
    const { getByText } = render(<QuizResult {...defaultProps} />);
    expect(getByText(/8.*10/)).toBeTruthy(); // "8 out of 10" or "8/10"
  });

  it('should render streak information', () => {
    const { getByText } = render(<QuizResult {...defaultProps} />);
    expect(getByText(/streak.*5/i)).toBeTruthy();
  });

  it('should render best score', () => {
    const { getByText } = render(<QuizResult {...defaultProps} />);
    expect(getByText(/best.*90/i)).toBeTruthy();
  });

  it('should show congratulatory message for high score', () => {
    const { getByText } = render(
      <QuizResult {...defaultProps} score={95} />
    );
    expect(getByText(/excellent|great|outstanding/i)).toBeTruthy();
  });

  it('should show encouraging message for low score', () => {
    const { getByText } = render(
      <QuizResult {...defaultProps} score={40} correctAnswers={4} />
    );
    expect(getByText(/keep practicing|try again|keep learning/i)).toBeTruthy();
  });

  it('should handle perfect score', () => {
    const { getByText } = render(
      <QuizResult 
        score={100} 
        totalQuestions={10} 
        correctAnswers={10}
        streak={10}
        bestScore={100}
      />
    );
    
    expect(getByText(/100%/i)).toBeTruthy();
    expect(getByText(/perfect/i)).toBeTruthy();
  });

  it('should handle zero score', () => {
    const { getByText } = render(
      <QuizResult 
        score={0} 
        totalQuestions={10} 
        correctAnswers={0}
        streak={0}
        bestScore={50}
      />
    );
    
    expect(getByText(/0%/i)).toBeTruthy();
  });

  it('should show improvement when score beats best score', () => {
    const { getByText } = render(
      <QuizResult 
        {...defaultProps}
        score={95}
        bestScore={80}
      />
    );
    
    expect(getByText(/new best|improved|personal best/i)).toBeTruthy();
  });

  it('should render with accessibility labels', () => {
    const { getByLabelText } = render(<QuizResult {...defaultProps} />);
    
    expect(getByLabelText(/quiz score/i)).toBeTruthy();
  });

  it('should display grade letter for score', () => {
    const testCases = [
      { score: 95, grade: 'A' },
      { score: 85, grade: 'B' },
      { score: 75, grade: 'C' },
      { score: 65, grade: 'D' },
      { score: 50, grade: 'F' },
    ];

    testCases.forEach(({ score, grade }) => {
      const { getByText } = render(
        <QuizResult {...defaultProps} score={score} />
      );
      expect(getByText(new RegExp(grade, 'i'))).toBeTruthy();
    });
  });

  it('should handle single question quiz', () => {
    const { getByText } = render(
      <QuizResult 
        score={100} 
        totalQuestions={1} 
        correctAnswers={1}
        streak={1}
        bestScore={100}
      />
    );
    
    expect(getByText(/1.*1/)).toBeTruthy();
  });

  it('should format large numbers correctly', () => {
    const { getByText } = render(
      <QuizResult 
        score={80} 
        totalQuestions={100} 
        correctAnswers={80}
        streak={50}
        bestScore={85}
      />
    );
    
    expect(getByText(/80.*100/)).toBeTruthy();
  });
});
