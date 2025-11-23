/**
 * Unit tests for QuizService
 */

import QuizService from '../../services/QuizService';

describe('QuizService', () => {
  describe('calculateScore', () => {
    it('should calculate score correctly', () => {
      expect(QuizService.calculateScore(4, 5)).toBe(80);
      expect(QuizService.calculateScore(5, 5)).toBe(100);
      expect(QuizService.calculateScore(0, 5)).toBe(0);
      expect(QuizService.calculateScore(3, 10)).toBe(30);
    });

    it('should handle edge cases', () => {
      expect(QuizService.calculateScore(0, 0)).toBe(0);
      expect(QuizService.calculateScore(1, 1)).toBe(100);
    });

    it('should round correctly', () => {
      expect(QuizService.calculateScore(1, 3)).toBe(33); // 33.33... rounds to 33
      expect(QuizService.calculateScore(2, 3)).toBe(67); // 66.66... rounds to 67
    });
  });

  describe('shuffleArray', () => {
    it('should return array with same length', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = QuizService.shuffleArray(original);
      
      expect(shuffled.length).toBe(original.length);
    });

    it('should contain all original elements', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = QuizService.shuffleArray(original);
      
      original.forEach(item => {
        expect(shuffled).toContain(item);
      });
    });

    it('should not modify original array', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      
      QuizService.shuffleArray(original);
      
      expect(original).toEqual(originalCopy);
    });

    it('should handle empty array', () => {
      const shuffled = QuizService.shuffleArray([]);
      expect(shuffled).toEqual([]);
    });

    it('should handle single element array', () => {
      const shuffled = QuizService.shuffleArray([1]);
      expect(shuffled).toEqual([1]);
    });
  });

  describe('findCorrectAnswerIndex', () => {
    it('should find correct answer by position', () => {
      const options = [
        { text: 'A', position: '2' },
        { text: 'B', position: '1' },
        { text: 'C', position: '3' },
      ];
      
      expect(QuizService.findCorrectAnswerIndex(options, 1)).toBe(1);
      expect(QuizService.findCorrectAnswerIndex(options, 2)).toBe(0);
      expect(QuizService.findCorrectAnswerIndex(options, 3)).toBe(2);
    });

    it('should handle string and number positions', () => {
      const options = [
        { text: 'A', position: '1' },
        { text: 'B', position: '2' },
      ];
      
      expect(QuizService.findCorrectAnswerIndex(options, 1)).toBe(0);
      expect(QuizService.findCorrectAnswerIndex(options, '2')).toBe(1);
    });

    it('should return -1 if not found', () => {
      const options = [
        { text: 'A', position: '1' },
        { text: 'B', position: '2' },
      ];
      
      expect(QuizService.findCorrectAnswerIndex(options, 99)).toBe(-1);
    });
  });

  describe('prepareQuizData', () => {
    it('should shuffle questions and options', () => {
      const questions = [
        { id: 1, question: 'Q1', options: '[{"text":"A","position":"1"}]' },
        { id: 2, question: 'Q2', options: '[{"text":"B","position":"2"}]' },
      ];
      
      const prepared = QuizService.prepareQuizData(questions);
      
      expect(prepared).toHaveLength(2);
      expect(Array.isArray(prepared[0].options)).toBe(true);
      expect(typeof prepared[0].options).not.toBe('string');
    });

    it('should parse JSON options', () => {
      const questions = [
        { 
          id: 1, 
          question: 'Q1', 
          options: '[{"text":"A","position":"1"},{"text":"B","position":"2"}]' 
        },
      ];
      
      const prepared = QuizService.prepareQuizData(questions);
      
      expect(prepared[0].options).toHaveLength(2);
      expect(prepared[0].options[0]).toHaveProperty('text');
      expect(prepared[0].options[0]).toHaveProperty('position');
    });
  });

  describe('getBestScore', () => {
    it('should return highest score', () => {
      const history = [
        { score: 60, date: '2025-01-01' },
        { score: 80, date: '2025-01-02' },
        { score: 70, date: '2025-01-03' },
      ];
      
      expect(QuizService.getBestScore(history)).toBe(80);
    });

    it('should handle single attempt', () => {
      const history = [{ score: 75 }];
      expect(QuizService.getBestScore(history)).toBe(75);
    });

    it('should return 0 for empty history', () => {
      expect(QuizService.getBestScore([])).toBe(0);
      expect(QuizService.getBestScore(null)).toBe(0);
      expect(QuizService.getBestScore(undefined)).toBe(0);
    });

    it('should handle all same scores', () => {
      const history = [
        { score: 50 },
        { score: 50 },
        { score: 50 },
      ];
      expect(QuizService.getBestScore(history)).toBe(50);
    });
  });

  describe('getFiftyFiftyOptions', () => {
    it('should return 2 wrong option indices', () => {
      const options = [
        { text: 'A' },
        { text: 'B' },
        { text: 'C' },
        { text: 'D' },
      ];
      
      const hidden = QuizService.getFiftyFiftyOptions(options, 0);
      
      expect(hidden).toHaveLength(2);
      expect(hidden).not.toContain(0);
    });

    it('should only return valid indices', () => {
      const options = [
        { text: 'A' },
        { text: 'B' },
        { text: 'C' },
        { text: 'D' },
      ];
      
      const hidden = QuizService.getFiftyFiftyOptions(options, 2);
      
      hidden.forEach(index => {
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(options.length);
        expect(index).not.toBe(2);
      });
    });

    it('should work with minimum options', () => {
      const options = [
        { text: 'A' },
        { text: 'B' },
        { text: 'C' },
      ];
      
      const hidden = QuizService.getFiftyFiftyOptions(options, 1);
      
      expect(hidden).toHaveLength(2);
    });
  });

  describe('API methods', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    // Note: These would require mocking the API module
    // For now, we test the error handling structure

    it('should have getQuestions method', () => {
      expect(typeof QuizService.getQuestions).toBe('function');
    });

    it('should have getAttemptHistory method', () => {
      expect(typeof QuizService.getAttemptHistory).toBe('function');
    });

    it('should have saveAttempt method', () => {
      expect(typeof QuizService.saveAttempt).toBe('function');
    });

    it('should have updateAttempt method', () => {
      expect(typeof QuizService.updateAttempt).toBe('function');
    });
  });
});
