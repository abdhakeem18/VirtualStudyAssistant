/**
 * Component tests for Card component
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import Card from '../../../screens/components/common/Card';

describe('Card Component', () => {
  it('should render with title and image', () => {
    const { getByText } = render(
      <Card 
        title="Test Material" 
        imageSource={require('../../../assets/images/cover-img1.png')} 
      />
    );
    
    expect(getByText('Test Material')).toBeTruthy();
  });

  it('should display the title text', () => {
    const { getByText } = render(
      <Card 
        title="Mathematics Course" 
        imageSource={require('../../../assets/images/cover-img1.png')} 
      />
    );
    
    expect(getByText('Mathematics Course')).toBeTruthy();
  });

  it('should render Image component with correct source', () => {
    const imageSource = require('../../../assets/images/cover-img1.png');
    const { UNSAFE_getByType } = render(
      <Card title="Test" imageSource={imageSource} />
    );
    
    const { Image } = require('react-native');
    const image = UNSAFE_getByType(Image);
    
    expect(image.props.source).toBe(imageSource);
  });

  it('should apply responsive image styles', () => {
    const { UNSAFE_getByType } = render(
      <Card 
        title="Test" 
        imageSource={require('../../../assets/images/cover-img1.png')} 
      />
    );
    
    const { Image } = require('react-native');
    const image = UNSAFE_getByType(Image);
    
    expect(image.props.className).toContain('w-full');
  });

  describe('Title rendering', () => {
    it('should handle long titles', () => {
      const longTitle = 'This is a very long title that might need to wrap to multiple lines';
      const { getByText } = render(
        <Card 
          title={longTitle} 
          imageSource={require('../../../assets/images/cover-img1.png')} 
        />
      );
      
      expect(getByText(longTitle)).toBeTruthy();
    });

    it('should handle short titles', () => {
      const { getByText } = render(
        <Card 
          title="Math" 
          imageSource={require('../../../assets/images/cover-img1.png')} 
        />
      );
      
      expect(getByText('Math')).toBeTruthy();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Math & Science: A Study Guide';
      const { getByText } = render(
        <Card 
          title={specialTitle} 
          imageSource={require('../../../assets/images/cover-img1.png')} 
        />
      );
      
      expect(getByText(specialTitle)).toBeTruthy();
    });
  });

  describe('Styling', () => {
    it('should have card container styles', () => {
      const { getByText } = render(
        <Card 
          title="Test" 
          imageSource={require('../../../assets/images/cover-img1.png')} 
        />
      );
      
      const titleElement = getByText('Test');
      const container = titleElement.parent?.parent;
      
      expect(container?.props.className).toBeDefined();
    });

    it('should have rounded corners', () => {
      const { getByText } = render(
        <Card 
          title="Test" 
          imageSource={require('../../../assets/images/cover-img1.png')} 
        />
      );
      
      const container = getByText('Test').parent?.parent;
      expect(container?.props.className).toContain('rounded');
    });
  });
});
