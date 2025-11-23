/**
 * Component tests for Button component
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../../screens/components/common/Button';

describe('Button Component', () => {
  it('should render with default props', () => {
    const { getByText } = render(
      <Button name="Click Me" callback={() => {}} />
    );
    
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('should call callback when pressed', () => {
    const mockCallback = jest.fn();
    const { getByText } = render(
      <Button name="Click Me" callback={mockCallback} />
    );
    
    fireEvent.press(getByText('Click Me'));
    
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it('should display loading state', () => {
    const { getByText } = render(
      <Button name="Submit" callback={() => {}} loading={true} />
    );
    
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should not call callback when loading', () => {
    const mockCallback = jest.fn();
    const { getByText } = render(
      <Button name="Submit" callback={mockCallback} loading={true} />
    );
    
    fireEvent.press(getByText('Loading...'));
    
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should not call callback when disabled', () => {
    const mockCallback = jest.fn();
    const { getByText } = render(
      <Button name="Submit" callback={mockCallback} disabled={true} />
    );
    
    fireEvent.press(getByText('Submit'));
    
    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should apply custom button classes', () => {
    const { getByText } = render(
      <Button 
        name="Custom" 
        callback={() => {}} 
        btnCls="bg-blue-500 px-4 py-2" 
      />
    );
    
    const button = getByText('Custom').parent;
    expect(button.props.className).toContain('bg-blue-500');
  });

  it('should apply custom text classes', () => {
    const { getByText } = render(
      <Button 
        name="Custom" 
        callback={() => {}} 
        textCls="text-white font-bold" 
      />
    );
    
    const text = getByText('Custom');
    expect(text.props.className).toContain('text-white');
  });

  it('should show ActivityIndicator when loading', () => {
    const { UNSAFE_getByType } = render(
      <Button name="Submit" callback={() => {}} loading={true} />
    );
    
    const ActivityIndicator = require('react-native').ActivityIndicator;
    expect(() => UNSAFE_getByType(ActivityIndicator)).not.toThrow();
  });

  describe('Accessibility', () => {
    it('should be accessible when enabled', () => {
      const { getByText } = render(
        <Button name="Submit" callback={() => {}} />
      );
      
      const button = getByText('Submit').parent;
      expect(button.props.accessible).not.toBe(false);
    });

    it('should indicate disabled state', () => {
      const { getByText } = render(
        <Button name="Submit" callback={() => {}} disabled={true} />
      );
      
      const button = getByText('Submit').parent;
      expect(button.props.disabled).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty name', () => {
      const { container } = render(
        <Button name="" callback={() => {}} />
      );
      
      expect(container).toBeTruthy();
    });

    it('should handle very long names', () => {
      const longName = 'A'.repeat(100);
      const { getByText } = render(
        <Button name={longName} callback={() => {}} />
      );
      
      expect(getByText(longName)).toBeTruthy();
    });

    it('should handle rapid clicks', () => {
      const mockCallback = jest.fn();
      const { getByText } = render(
        <Button name="Click" callback={mockCallback} />
      );
      
      const button = getByText('Click');
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);
      
      expect(mockCallback).toHaveBeenCalledTimes(3);
    });
  });
});
