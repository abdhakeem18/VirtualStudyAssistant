import React from 'react';
import { render } from '@testing-library/react-native';
import Summary from '../../../screens/components/common/Summary';

describe('Summary Component', () => {
  const mockSummary = {
    title: 'Introduction to React',
    summary: 'React is a JavaScript library for building user interfaces. It uses a component-based architecture and virtual DOM for efficient rendering.',
    keyPoints: [
      'Component-based architecture',
      'Virtual DOM',
      'Declarative UI',
      'One-way data flow',
    ],
  };

  it('should render summary title', () => {
    const { getByText } = render(<Summary data={mockSummary} />);
    expect(getByText('Introduction to React')).toBeTruthy();
  });

  it('should render summary text', () => {
    const { getByText } = render(<Summary data={mockSummary} />);
    expect(getByText(/React is a JavaScript library/i)).toBeTruthy();
  });

  it('should render all key points', () => {
    const { getByText } = render(<Summary data={mockSummary} />);
    
    expect(getByText('Component-based architecture')).toBeTruthy();
    expect(getByText('Virtual DOM')).toBeTruthy();
    expect(getByText('Declarative UI')).toBeTruthy();
    expect(getByText('One-way data flow')).toBeTruthy();
  });

  it('should handle summary without key points', () => {
    const summaryWithoutPoints = {
      title: 'Basic Concept',
      summary: 'This is a simple summary without key points.',
    };

    const { getByText, queryByText } = render(
      <Summary data={summaryWithoutPoints} />
    );
    
    expect(getByText('Basic Concept')).toBeTruthy();
    expect(queryByText(/key points/i)).toBeNull();
  });

  it('should handle long summary text', () => {
    const longSummary = {
      title: 'Complex Topic',
      summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20),
    };

    const { getByText } = render(<Summary data={longSummary} />);
    expect(getByText('Complex Topic')).toBeTruthy();
  });

  it('should handle empty summary data gracefully', () => {
    const { queryByText } = render(<Summary data={{}} />);
    expect(queryByText(/error|loading/i)).toBeTruthy();
  });

  it('should render with proper formatting', () => {
    const { getByText } = render(<Summary data={mockSummary} />);
    
    const titleElement = getByText('Introduction to React');
    expect(titleElement.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontSize: expect.any(Number) })
      ])
    );
  });

  it('should handle special characters in summary', () => {
    const specialSummary = {
      title: 'Symbols & Characters',
      summary: 'This includes special chars: @, #, $, %, &, *, <, >',
    };

    const { getByText } = render(<Summary data={specialSummary} />);
    expect(getByText(/special chars/i)).toBeTruthy();
  });

  it('should render bullet points correctly', () => {
    const { getAllByText } = render(<Summary data={mockSummary} />);
    const bulletPoints = getAllByText(/•/);
    
    expect(bulletPoints.length).toBe(mockSummary.keyPoints.length);
  });

  it('should be scrollable for long content', () => {
    const { getByTestId } = render(
      <Summary data={mockSummary} testID="summary-scroll" />
    );
    
    const scrollView = getByTestId('summary-scroll');
    expect(scrollView.props.scrollEnabled).toBeTruthy();
  });
});
