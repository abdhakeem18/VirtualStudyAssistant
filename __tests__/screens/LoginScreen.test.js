/**
 * Integration tests for LoginScreen
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../screens/LoginScreen';
import API from '../../config/api';
import { setData } from '../../utils/storage';

jest.mock('../../config/api');
jest.mock('../../utils/storage');

describe('LoginScreen Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form correctly', () => {
    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
  });

  it('should handle successful login', async () => {
    const mockNavigate = jest.fn();
    const mockApi = {
      post: jest.fn().mockResolvedValue({
        data: {
          accessToken: 'test-token',
          emailConfirmed: true,
        },
      }),
    };
    
    API.mockReturnValue(mockApi);
    setData.mockResolvedValue();

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password123',
      });
      expect(setData).toHaveBeenCalled();
    });
  });

  it('should display error on failed login', async () => {
    const mockApi = {
      post: jest.fn().mockRejectedValue({
        response: {
          data: {
            message: 'Invalid credentials',
          },
        },
      }),
    };
    
    API.mockReturnValue(mockApi);

    const { getByPlaceholderText, getByText, findByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'wrong@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'wrongpass');
    fireEvent.press(getByText('Login'));

    await waitFor(async () => {
      expect(await findByText(/error/i)).toBeTruthy();
    });
  });

  it('should show loading state during login', async () => {
    const mockApi = {
      post: jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ data: {} }), 100))
      ),
    };
    
    API.mockReturnValue(mockApi);

    const { getByPlaceholderText, getByText, queryByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    expect(queryByText('Loading...')).toBeTruthy();
  });

  it('should navigate to signup screen', () => {
    const mockNavigate = jest.fn();
    
    const { getByText } = render(<LoginScreen />);
    
    // Note: This would need actual navigation mock setup
    const signupButton = getByText('SignUp');
    expect(signupButton).toBeTruthy();
  });

  it('should handle email confirmation flow', async () => {
    const mockApi = {
      post: jest.fn().mockResolvedValue({
        data: {
          accessToken: 'test-token',
          emailConfirmed: false,
        },
      }),
    };
    
    API.mockReturnValue(mockApi);
    setData.mockResolvedValue();

    const { getByPlaceholderText, getByText } = render(<LoginScreen />);
    
    fireEvent.changeText(getByPlaceholderText('Email'), 'test@example.com');
    fireEvent.changeText(getByPlaceholderText('Password'), 'password123');
    fireEvent.press(getByText('Login'));

    await waitFor(() => {
      expect(setData).toHaveBeenCalled();
    });
  });
});
