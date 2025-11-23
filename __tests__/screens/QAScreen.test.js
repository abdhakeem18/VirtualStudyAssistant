import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import QAScreen from '../../screens/QAScreen';
import QuizService from '../../services/QuizService';

// Mock dependencies
jest.mock('../../services/QuizService');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    goBack: jest.fn(),
  }),
  useRoute: () => ({
    params: {
      docId: 1,
      title: 'Test Quiz',
    },
  }),
}));

describe('QAScreen Integration Tests', () => {
  const mockQuestions = [
    {
      id: 1,
      question: 'What is 2 + 2?',
      options: JSON.stringify([
        { text: '3', position: '1', explanation: 'Incorrect' },
        { text: '4', position: '2', explanation: 'Correct!' },
        { text: '5', position: '3', explanation: 'Incorrect' },
        { text: '6', position: '4', explanation: 'Incorrect' },
      ]),
      answer: '2',
    },
    {
      id: 2,
      question: 'What is 10 - 5?',
      options: JSON.stringify([
        { text: '4', position: '1', explanation: 'Incorrect' },
        { text: '5', position: '2', explanation: 'Correct!' },
        { text: '6', position: '3', explanation: 'Incorrect' },
        { text: '7', position: '4', explanation: 'Incorrect' },
      ]),
      answer: '2',
    },
    {
      id: 3,
      question: 'What is 3 × 3?',
      options: JSON.stringify([
        { text: '6', position: '1', explanation: 'Incorrect' },
        { text: '9', position: '2', explanation: 'Correct!' },
        { text: '12', position: '3', explanation: 'Incorrect' },
        { text: '15', position: '4', explanation: 'Incorrect' },
      ]),
      answer: '2',
    },
  ];

  const mockHistory = {
    success: true,
    history: {
      id: 1,
      quizHistory: JSON.stringify([
        { score: 80, date: '2025-11-01', streak: 3 },
        { score: 90, date: '2025-11-05', streak: 5 },
      ]),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    QuizService.getQuestions.mockResolvedValue({
      success: true,
      questions: mockQuestions,
    });
    QuizService.getAttemptHistory.mockResolvedValue(mockHistory);
    QuizService.prepareQuizData.mockImplementation((questions) => questions);
    QuizService.calculateScore.mockImplementation((correct, total) =>
      Math.round((correct / total) * 100)
    );
    QuizService.findCorrectAnswerIndex.mockImplementation((options, position) =>
      options.findIndex((opt) => parseInt(opt.position) === parseInt(position))
    );
  });

  describe('Quiz Loading', () => {
    it('should load quiz questions on mount', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => {
        expect(QuizService.getQuestions).toHaveBeenCalledWith(1);
        expect(getByText('What is 2 + 2?')).toBeTruthy();
      });
    });

    it('should show loading state while fetching questions', () => {
      QuizService.getQuestions.mockReturnValue(
        new Promise((resolve) => setTimeout(resolve, 1000))
      );

      const { getByText } = render(<QAScreen />);
      expect(getByText(/loading/i)).toBeTruthy();
    });

    it('should handle API error gracefully', async () => {
      QuizService.getQuestions.mockRejectedValue(
        new Error('Failed to load questions')
      );

      const { getByText } = render(<QAScreen />);

      await waitFor(() => {
        expect(getByText(/failed to load/i)).toBeTruthy();
      });
    });

    it('should load attempt history', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => {
        expect(QuizService.getAttemptHistory).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Quiz Navigation', () => {
    it('should navigate to next question', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      fireEvent.press(getByText(/next/i));

      await waitFor(() => {
        expect(getByText('What is 10 - 5?')).toBeTruthy();
      });
    });

    it('should navigate to previous question', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      fireEvent.press(getByText(/next/i));
      await waitFor(() => expect(getByText('What is 10 - 5?')).toBeTruthy());

      fireEvent.press(getByText(/previous/i));
      await waitFor(() => {
        expect(getByText('What is 2 + 2?')).toBeTruthy();
      });
    });

    it('should disable previous button on first question', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      const prevButton = getByText(/previous/i);
      expect(prevButton.props.disabled).toBeTruthy();
    });

    it('should disable next button on last question', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      // Navigate to last question
      fireEvent.press(getByText(/next/i));
      await waitFor(() => {});
      fireEvent.press(getByText(/next/i));

      await waitFor(() => expect(getByText('What is 3 × 3?')).toBeTruthy());

      const nextButton = getByText(/next/i);
      expect(nextButton.props.disabled).toBeTruthy();
    });
  });

  describe('Answer Selection', () => {
    it('should select answer when option is clicked', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      fireEvent.press(getByText('4'));

      expect(getByText('4').parent.props.style).toContainEqual(
        expect.objectContaining({ backgroundColor: expect.any(String) })
      );
    });

    it('should allow changing answer before submission', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      fireEvent.press(getByText('3'));
      fireEvent.press(getByText('4')); // Change answer

      expect(getByText('4').parent.props.selected).toBeTruthy();
    });

    it('should remember answer when navigating between questions', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      // Answer first question
      fireEvent.press(getByText('4'));

      // Go to next question
      fireEvent.press(getByText(/next/i));
      await waitFor(() => expect(getByText('What is 10 - 5?')).toBeTruthy());

      // Go back
      fireEvent.press(getByText(/previous/i));
      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      // Answer should still be selected
      expect(getByText('4').parent.props.selected).toBeTruthy();
    });
  });

  describe('Lifelines', () => {
    it('should use 50/50 lifeline', async () => {
      QuizService.getFiftyFiftyOptions.mockReturnValue([0, 2]);

      const { getByText, queryByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      fireEvent.press(getByText(/50.*50/i));

      await waitFor(() => {
        expect(queryByText('3')).toBeNull(); // Hidden
        expect(queryByText('5')).toBeNull(); // Hidden
        expect(queryByText('4')).toBeTruthy(); // Visible
        expect(queryByText('6')).toBeTruthy(); // Visible
      });
    });

    it('should disable 50/50 lifeline after use', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      const fiftyFiftyButton = getByText(/50.*50/i);
      fireEvent.press(fiftyFiftyButton);

      await waitFor(() => {
        expect(fiftyFiftyButton.props.disabled).toBeTruthy();
      });
    });
  });

  describe('Quiz Submission', () => {
    it('should enable submit button when all questions answered', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      // Answer all questions
      fireEvent.press(getByText('4'));
      fireEvent.press(getByText(/next/i));

      await waitFor(() => {});
      fireEvent.press(getByText('5'));
      fireEvent.press(getByText(/next/i));

      await waitFor(() => {});
      fireEvent.press(getByText('9'));

      await waitFor(() => {
        const submitButton = getByText(/submit/i);
        expect(submitButton.props.disabled).toBeFalsy();
      });
    });

    it('should calculate score correctly', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      // Answer all correctly
      fireEvent.press(getByText('4'));
      fireEvent.press(getByText(/next/i));
      await waitFor(() => {});
      fireEvent.press(getByText('5'));
      fireEvent.press(getByText(/next/i));
      await waitFor(() => {});
      fireEvent.press(getByText('9'));

      fireEvent.press(getByText(/submit/i));

      await waitFor(() => {
        expect(QuizService.calculateScore).toHaveBeenCalledWith(3, 3);
        expect(getByText(/100%/i)).toBeTruthy();
      });
    });

    it('should show quiz results after submission', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      // Answer and submit
      fireEvent.press(getByText('4'));
      fireEvent.press(getByText(/next/i));
      await waitFor(() => {});
      fireEvent.press(getByText('5'));
      fireEvent.press(getByText(/next/i));
      await waitFor(() => {});
      fireEvent.press(getByText('9'));
      fireEvent.press(getByText(/submit/i));

      await waitFor(() => {
        expect(getByText(/quiz complete/i)).toBeTruthy();
        expect(getByText(/score/i)).toBeTruthy();
        expect(getByText(/streak/i)).toBeTruthy();
      });
    });

    it('should save attempt history after submission', async () => {
      QuizService.saveAttempt.mockResolvedValue({ success: true });

      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      // Complete quiz
      fireEvent.press(getByText('4'));
      fireEvent.press(getByText(/next/i));
      await waitFor(() => {});
      fireEvent.press(getByText('5'));
      fireEvent.press(getByText(/next/i));
      await waitFor(() => {});
      fireEvent.press(getByText('9'));
      fireEvent.press(getByText(/submit/i));

      await waitFor(() => {
        expect(QuizService.saveAttempt).toHaveBeenCalled();
      });
    });

    it('should show review answers option', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      // Complete and submit quiz
      fireEvent.press(getByText('4'));
      fireEvent.press(getByText(/next/i));
      await waitFor(() => {});
      fireEvent.press(getByText('5'));
      fireEvent.press(getByText(/next/i));
      await waitFor(() => {});
      fireEvent.press(getByText('9'));
      fireEvent.press(getByText(/submit/i));

      await waitFor(() => {
        expect(getByText(/review answers/i)).toBeTruthy();
      });
    });
  });

  describe('Attempt History', () => {
    it('should display attempt history', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => {
        expect(getByText(/previous attempts/i)).toBeTruthy();
        expect(getByText(/80%/)).toBeTruthy();
        expect(getByText(/90%/)).toBeTruthy();
      });
    });

    it('should show best score', async () => {
      QuizService.getBestScore.mockReturnValue(90);

      const { getByText } = render(<QAScreen />);

      await waitFor(() => {
        expect(getByText(/best.*90/i)).toBeTruthy();
      });
    });

    it('should display score graph', async () => {
      const { getByTestId } = render(<QAScreen />);

      await waitFor(() => {
        expect(getByTestId('score-graph')).toBeTruthy();
      });
    });
  });

  describe('Quiz Restart', () => {
    it('should restart quiz when retry button is pressed', async () => {
      const { getByText } = render(<QAScreen />);

      await waitFor(() => expect(getByText('What is 2 + 2?')).toBeTruthy());

      // Complete quiz
      fireEvent.press(getByText('4'));
      fireEvent.press(getByText(/next/i));
      await waitFor(() => {});
      fireEvent.press(getByText('5'));
      fireEvent.press(getByText(/next/i));
      await waitFor(() => {});
      fireEvent.press(getByText('9'));
      fireEvent.press(getByText(/submit/i));

      await waitFor(() => expect(getByText(/quiz complete/i)).toBeTruthy());

      // Restart
      fireEvent.press(getByText(/try again|restart/i));

      await waitFor(() => {
        expect(getByText('What is 2 + 2?')).toBeTruthy();
        expect(getByText('Question 1 of 3')).toBeTruthy();
      });
    });
  });
});
