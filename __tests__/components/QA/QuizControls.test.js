import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import QuizControls from '../../../screens/components/QA/QuizControls';

describe('QuizControls Component', () => {
  const defaultProps = {
    onNext: jest.fn(),
    onPrevious: jest.fn(),
    onSubmit: jest.fn(),
    onFiftyFifty: jest.fn(),
    currentQuestion: 0,
    totalQuestions: 5,
    hasNext: true,
    hasPrevious: false,
    canSubmit: false,
    fiftyFiftyUsed: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all control buttons', () => {
    const { getByText } = render(<QuizControls {...defaultProps} />);
    
    expect(getByText(/next/i)).toBeTruthy();
    expect(getByText(/previous/i)).toBeTruthy();
    expect(getByText(/50.*50/i)).toBeTruthy();
  });

  it('should call onNext when Next button is pressed', () => {
    const mockNext = jest.fn();
    const { getByText } = render(
      <QuizControls {...defaultProps} onNext={mockNext} />
    );
    
    fireEvent.press(getByText(/next/i));
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  it('should call onPrevious when Previous button is pressed', () => {
    const mockPrevious = jest.fn();
    const { getByText } = render(
      <QuizControls 
        {...defaultProps} 
        hasPrevious={true}
        onPrevious={mockPrevious} 
      />
    );
    
    fireEvent.press(getByText(/previous/i));
    expect(mockPrevious).toHaveBeenCalledTimes(1);
  });

  it('should disable Previous button on first question', () => {
    const mockPrevious = jest.fn();
    const { getByText } = render(
      <QuizControls 
        {...defaultProps} 
        hasPrevious={false}
        currentQuestion={0}
        onPrevious={mockPrevious}
      />
    );
    
    const prevButton = getByText(/previous/i);
    fireEvent.press(prevButton);
    
    expect(mockPrevious).not.toHaveBeenCalled();
  });

  it('should disable Next button on last question', () => {
    const mockNext = jest.fn();
    const { getByText } = render(
      <QuizControls 
        {...defaultProps} 
        hasNext={false}
        currentQuestion={4}
        totalQuestions={5}
        onNext={mockNext}
      />
    );
    
    const nextButton = getByText(/next/i);
    fireEvent.press(nextButton);
    
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should show Submit button when all questions answered', () => {
    const { getByText } = render(
      <QuizControls 
        {...defaultProps} 
        canSubmit={true}
        currentQuestion={4}
        hasNext={false}
      />
    );
    
    expect(getByText(/submit/i)).toBeTruthy();
  });

  it('should call onSubmit when Submit button is pressed', () => {
    const mockSubmit = jest.fn();
    const { getByText } = render(
      <QuizControls 
        {...defaultProps} 
        canSubmit={true}
        onSubmit={mockSubmit}
      />
    );
    
    fireEvent.press(getByText(/submit/i));
    expect(mockSubmit).toHaveBeenCalledTimes(1);
  });

  it('should disable Submit button when not all questions answered', () => {
    const mockSubmit = jest.fn();
    const { getByText } = render(
      <QuizControls 
        {...defaultProps} 
        canSubmit={false}
        onSubmit={mockSubmit}
      />
    );
    
    const submitButton = getByText(/submit/i);
    fireEvent.press(submitButton);
    
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('should call onFiftyFifty when 50/50 lifeline is used', () => {
    const mockFiftyFifty = jest.fn();
    const { getByText } = render(
      <QuizControls 
        {...defaultProps} 
        onFiftyFifty={mockFiftyFifty}
      />
    );
    
    fireEvent.press(getByText(/50.*50/i));
    expect(mockFiftyFifty).toHaveBeenCalledTimes(1);
  });

  it('should disable 50/50 lifeline after use', () => {
    const mockFiftyFifty = jest.fn();
    const { getByText } = render(
      <QuizControls 
        {...defaultProps} 
        fiftyFiftyUsed={true}
        onFiftyFifty={mockFiftyFifty}
      />
    );
    
    const fiftyFiftyButton = getByText(/50.*50/i);
    fireEvent.press(fiftyFiftyButton);
    
    expect(mockFiftyFifty).not.toHaveBeenCalled();
  });

  it('should show used indicator on 50/50 button after use', () => {
    const { getByText } = render(
      <QuizControls {...defaultProps} fiftyFiftyUsed={true} />
    );
    
    expect(getByText(/used|disabled/i)).toBeTruthy();
  });

  it('should display progress indicator', () => {
    const { getByText } = render(
      <QuizControls {...defaultProps} currentQuestion={2} totalQuestions={5} />
    );
    
    expect(getByText(/3.*5/)).toBeTruthy(); // Question 3 of 5
  });

  it('should handle rapid button clicks', () => {
    const mockNext = jest.fn();
    const { getByText } = render(
      <QuizControls {...defaultProps} onNext={mockNext} />
    );
    
    const nextButton = getByText(/next/i);
    fireEvent.press(nextButton);
    fireEvent.press(nextButton);
    fireEvent.press(nextButton);
    
    // Should debounce or handle multiple clicks gracefully
    expect(mockNext.mock.calls.length).toBeGreaterThan(0);
  });

  it('should show different styles for enabled/disabled buttons', () => {
    const { getByText } = render(
      <QuizControls 
        {...defaultProps} 
        hasPrevious={false}
        hasNext={true}
      />
    );
    
    const prevButton = getByText(/previous/i).parent;
    const nextButton = getByText(/next/i).parent;
    
    // Disabled button should have different style
    expect(prevButton.props.style).toContainEqual(
      expect.objectContaining({ opacity: expect.any(Number) })
    );
  });

  it('should render with accessibility labels', () => {
    const { getByLabelText } = render(<QuizControls {...defaultProps} />);
    
    expect(getByLabelText(/next question/i)).toBeTruthy();
    expect(getByLabelText(/previous question/i)).toBeTruthy();
  });
});
