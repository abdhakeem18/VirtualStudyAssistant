import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HomeScreen from '../../screens/HomeScreen';
import DocumentService from '../../services/DocumentService';
import { getData } from '../../utils/storage';

// Mock dependencies
jest.mock('../../services/DocumentService');
jest.mock('../../utils/storage');
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

describe('HomeScreen Integration Tests', () => {
  const mockDocuments = [
    {
      id: 1,
      title: 'Chapter 1',
      group: 'Mathematics',
      summaries: JSON.stringify({ summary: 'Math intro' }),
    },
    {
      id: 2,
      title: 'Chapter 2',
      group: 'Mathematics',
      summaries: JSON.stringify({ summary: 'Advanced math' }),
    },
    {
      id: 3,
      title: 'Intro to Physics',
      group: 'Physics',
      summaries: JSON.stringify({ summary: 'Physics basics' }),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    getData.mockResolvedValue({ accessToken: 'test-token' });
    DocumentService.getAll.mockResolvedValue({
      success: true,
      documents: mockDocuments,
    });
  });

  describe('Document Loading', () => {
    it('should load and display documents on mount', async () => {
      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText('Mathematics')).toBeTruthy();
        expect(getByText('Physics')).toBeTruthy();
      });
    });

    it('should group documents by group name', async () => {
      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText('Mathematics')).toBeTruthy();
        expect(getByText('2 materials')).toBeTruthy(); // 2 Math docs
        expect(getByText('Physics')).toBeTruthy();
        expect(getByText('1 material')).toBeTruthy(); // 1 Physics doc
      });
    });

    it('should show loading state while fetching documents', () => {
      DocumentService.getAll.mockReturnValue(
        new Promise((resolve) => setTimeout(resolve, 1000))
      );

      const { getByText } = render(<HomeScreen />);
      expect(getByText(/loading/i)).toBeTruthy();
    });

    it('should handle API error gracefully', async () => {
      DocumentService.getAll.mockRejectedValue(
        new Error('Failed to fetch documents')
      );

      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText(/failed to fetch/i)).toBeTruthy();
      });
    });

    it('should prevent duplicate group entries', async () => {
      const duplicatesDocs = [
        ...mockDocuments,
        {
          id: 4,
          title: 'Chapter 3',
          group: 'Mathematics', // Duplicate group
          summaries: '{}',
        },
      ];

      DocumentService.getAll.mockResolvedValue({
        success: true,
        documents: duplicatesDocs,
      });

      const { getAllByText } = render(<HomeScreen />);

      await waitFor(() => {
        const mathGroups = getAllByText('Mathematics');
        expect(mathGroups.length).toBe(1); // Should only show once
      });
    });
  });

  describe('Material Upload', () => {
    it('should show upload modal when upload button is pressed', async () => {
      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        fireEvent.press(getByText(/upload/i));
      });

      expect(getByText(/select material/i)).toBeTruthy();
    });

    it('should upload material successfully with loading timer', async () => {
      const mockFile = {
        uri: 'file://test.pdf',
        name: 'test.pdf',
        mimeType: 'application/pdf',
      };

      DocumentService.upload.mockResolvedValue({
        success: true,
        message: 'Upload successful',
      });

      const { getByText, getByPlaceholderText } = render(<HomeScreen />);

      await waitFor(() => fireEvent.press(getByText(/upload/i)));

      fireEvent.changeText(getByPlaceholderText('Title'), 'Test Document');
      fireEvent.changeText(getByPlaceholderText('Group'), 'Test Group');
      
      // Mock file selection
      fireEvent.press(getByText(/select file/i));

      fireEvent.press(getByText(/upload/i));

      await waitFor(() => {
        expect(getByText(/uploading/i)).toBeTruthy();
        expect(getByText(/\d+ seconds/)).toBeTruthy(); // Timer countdown
      });

      await waitFor(() => {
        expect(getByText(/upload successful/i)).toBeTruthy();
      }, { timeout: 3000 });
    });

    it('should validate required fields before upload', async () => {
      const { getByText } = render(<HomeScreen />);

      await waitFor(() => fireEvent.press(getByText(/upload/i)));

      // Try to upload without filling fields
      fireEvent.press(getByText(/upload/i));

      await waitFor(() => {
        expect(getByText(/all fields are required/i)).toBeTruthy();
      });
    });

    it('should handle upload failure', async () => {
      DocumentService.upload.mockRejectedValue(
        new Error('Upload failed')
      );

      const { getByText, getByPlaceholderText } = render(<HomeScreen />);

      await waitFor(() => fireEvent.press(getByText(/upload/i)));

      fireEvent.changeText(getByPlaceholderText('Title'), 'Test');
      fireEvent.changeText(getByPlaceholderText('Group'), 'Test');
      fireEvent.press(getByText(/upload/i));

      await waitFor(() => {
        expect(getByText(/upload failed/i)).toBeTruthy();
      });
    });
  });

  describe('Material Management', () => {
    it('should open rename modal when rename is clicked', async () => {
      const { getAllByText, getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText('Mathematics')).toBeTruthy();
      });

      // Long press or click menu on group
      fireEvent.press(getAllByText(/•••/)[0]);
      fireEvent.press(getByText(/rename/i));

      await waitFor(() => {
        expect(getByText(/rename group/i)).toBeTruthy();
        expect(getByPlaceholderText(/new name/i)).toBeTruthy();
      });
    });

    it('should rename group successfully', async () => {
      DocumentService.renameGroup.mockResolvedValue({
        success: true,
        message: 'Renamed successfully',
      });

      const { getAllByText, getByText, getByPlaceholderText } = render(
        <HomeScreen />
      );

      await waitFor(() => expect(getByText('Mathematics')).toBeTruthy());

      fireEvent.press(getAllByText(/•••/)[0]);
      fireEvent.press(getByText(/rename/i));

      fireEvent.changeText(
        getByPlaceholderText(/new name/i),
        'Advanced Mathematics'
      );
      fireEvent.press(getByText(/save/i));

      await waitFor(() => {
        expect(DocumentService.renameGroup).toHaveBeenCalledWith({
          oldName: 'Mathematics',
          newName: 'Advanced Mathematics',
        });
        expect(getByText(/renamed successfully/i)).toBeTruthy();
      });
    });

    it('should open delete confirmation modal', async () => {
      const { getAllByText, getByText } = render(<HomeScreen />);

      await waitFor(() => expect(getByText('Mathematics')).toBeTruthy());

      fireEvent.press(getAllByText(/•••/)[0]);
      fireEvent.press(getByText(/delete/i));

      await waitFor(() => {
        expect(getByText(/are you sure/i)).toBeTruthy();
        expect(getByText(/this action cannot be undone/i)).toBeTruthy();
      });
    });

    it('should delete group successfully', async () => {
      DocumentService.deleteGroup.mockResolvedValue({
        success: true,
        message: 'Deleted successfully',
      });

      const { getAllByText, getByText, queryByText } = render(<HomeScreen />);

      await waitFor(() => expect(getByText('Mathematics')).toBeTruthy());

      fireEvent.press(getAllByText(/•••/)[0]);
      fireEvent.press(getByText(/delete/i));
      fireEvent.press(getByText(/confirm/i));

      await waitFor(() => {
        expect(DocumentService.deleteGroup).toHaveBeenCalledWith('Mathematics');
        expect(queryByText('Mathematics')).toBeNull();
      });
    });

    it('should cancel delete when cancel is pressed', async () => {
      const { getAllByText, getByText } = render(<HomeScreen />);

      await waitFor(() => expect(getByText('Mathematics')).toBeTruthy());

      fireEvent.press(getAllByText(/•••/)[0]);
      fireEvent.press(getByText(/delete/i));
      fireEvent.press(getByText(/cancel/i));

      await waitFor(() => {
        expect(DocumentService.deleteGroup).not.toHaveBeenCalled();
        expect(getByText('Mathematics')).toBeTruthy();
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to details when group is clicked', async () => {
      const mockNavigate = jest.fn();
      jest.spyOn(require('@react-navigation/native'), 'useNavigation')
        .mockReturnValue({ navigate: mockNavigate });

      const { getByText } = render(<HomeScreen />);

      await waitFor(() => expect(getByText('Mathematics')).toBeTruthy());

      fireEvent.press(getByText('Mathematics'));

      expect(mockNavigate).toHaveBeenCalledWith('Details', {
        groupName: 'Mathematics',
      });
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no documents', async () => {
      DocumentService.getAll.mockResolvedValue({
        success: true,
        documents: [],
      });

      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(getByText(/no materials yet/i)).toBeTruthy();
        expect(getByText(/upload your first material/i)).toBeTruthy();
      });
    });
  });
});
