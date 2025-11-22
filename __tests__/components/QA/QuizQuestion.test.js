import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import QuizQuestion from '../../../screens/components/QA/QuizQuestion';

describe('QuizQuestion Component', () => {
  const mockQuestion = {
    question: 'What is 2 + 2?',
    options: [
      { text: '3', position: '1' },
      { text: '4', position: '2' },
      { text: '5', position: '3' },
      { text: '6', position: '4' },
    ],
  };

  const defaultProps = {
    currentQuestion: 0,
    totalQuestions: 5,
    question: mockQuestion,
    selectedOption: null,
    onSelectOption: jest.fn(),
    hiddenOptions: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render question text', () => {
    const { getByText } = render(<QuizQuestion {...defaultProps} />);
    expect(getByText('What is 2 + 2?')).toBeTruthy();
  });

  it('should render question counter', () => {
    const { getByText } = render(<QuizQuestion {...defaultProps} />);
    expect(getByText(/Question 1 of 5/i)).toBeTruthy();
  });

  it('should render all options', () => {
    const { getByText } = render(<QuizQuestion {...defaultProps} />);
    
    expect(getByText('3')).toBeTruthy();
    expect(getByText('4')).toBeTruthy();
    expect(getByText('5')).toBeTruthy();
    expect(getByText('6')).toBeTruthy();
  });

  it('should call onSelectOption when option is clicked', () => {
    const mockSelect = jest.fn();
    const { getByText } = render(
      <QuizQuestion {...defaultProps} onSelectOption={mockSelect} />
    );
    
    fireEvent.press(getByText('4'));
    expect(mockSelect).toHaveBeenCalledWith(1); // Index of option
  });

  it('should highlight selected option', () => {
    const { getByText } = render(
      <QuizQuestion {...defaultProps} selectedOption={1} />
    );
    
    const selectedButton = getByText('4').parent;
    expect(selectedButton.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: expect.any(String) })
      ])
    );
  });

  it('should hide options when using 50/50 lifeline', () => {
    const { queryByText } = render(
      <QuizQuestion {...defaultProps} hiddenOptions={[0, 2]} />
    );
    
    // Hidden options should not be visible
    expect(queryByText('3')).toBeNull();
    expect(queryByText('5')).toBeNull();
    
    // Visible options should still be there
    expect(queryByText('4')).toBeTruthy();
    expect(queryByText('6')).toBeTruthy();
  });

  it('should disable options when already answered', () => {
    const mockSelect = jest.fn();
    const { getByText } = render(
      <QuizQuestion 
        {...defaultProps} 
        selectedOption={1}
        disabled={true}
        onSelectOption={mockSelect}
      />
    );
    
    fireEvent.press(getByText('4'));
    expect(mockSelect).not.toHaveBeenCalled();
  });

  it('should render with long question text', () => {
    const longQuestion = {
      ...mockQuestion,
      question: 'This is a very long question that spans multiple lines and tests how the component handles extensive text content that might wrap to several lines in the UI.',
    };

    const { getByText } = render(
      <QuizQuestion {...defaultProps} question={longQuestion} />
    );
    
    expect(getByText(longQuestion.question)).toBeTruthy();
  });

  it('should handle special characters in question', () => {
    const specialQuestion = {
      ...mockQuestion,
      question: 'What is the value of π (pi) × 2?',
    };

    const { getByText } = render(
      <QuizQuestion {...defaultProps} question={specialQuestion} />
    );
    
    expect(getByText('What is the value of π (pi) × 2?')).toBeTruthy();
  });

  it('should update when currentQuestion prop changes', () => {
    const { getByText, rerender } = render(
      <QuizQuestion {...defaultProps} currentQuestion={0} />
    );
    
    expect(getByText('Question 1 of 5')).toBeTruthy();
    
    rerender(
      <QuizQuestion {...defaultProps} currentQuestion={2} />
    );
    
    expect(getByText('Question 3 of 5')).toBeTruthy();
  });
});
