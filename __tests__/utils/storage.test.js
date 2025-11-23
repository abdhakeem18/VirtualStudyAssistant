/**
 * Unit tests for storage utility functions
 * Tests AsyncStorage wrapper functions for data persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { setData, getData, removeData } from '../../utils/storage';

describe('Storage Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setData', () => {
    it('should store data successfully', async () => {
      const key = 'testKey';
      const value = { name: 'test', id: 1 };

      await setData(key, value);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify(value)
      );
    });

    it('should handle errors when storing data', async () => {
      const key = 'testKey';
      const value = { name: 'test' };
      const error = new Error('Storage error');

      AsyncStorage.setItem.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await setData(key, value);

      expect(console.error).toHaveBeenCalledWith(
        'Error saving data:',
        error
      );
    });

    it('should handle null or undefined values', async () => {
      await setData('key', null);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('key', 'null');

      await setData('key', undefined);
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('getData', () => {
    it('should retrieve and parse stored data', async () => {
      const key = 'testKey';
      const storedData = { name: 'test', id: 1 };

      AsyncStorage.getItem.mockResolvedValueOnce(
        JSON.stringify(storedData)
      );

      const result = await getData(key);

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
      expect(result).toEqual(storedData);
    });

    it('should return null when no data exists', async () => {
      const key = 'nonExistentKey';

      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await getData(key);

      expect(result).toBeNull();
    });

    it('should handle JSON parse errors', async () => {
      const key = 'testKey';
      AsyncStorage.getItem.mockResolvedValueOnce('invalid json');
      console.error = jest.fn();

      const result = await getData(key);

      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle storage retrieval errors', async () => {
      const key = 'testKey';
      const error = new Error('Retrieval error');

      AsyncStorage.getItem.mockRejectedValueOnce(error);
      console.error = jest.fn();

      const result = await getData(key);

      expect(console.error).toHaveBeenCalledWith(
        'Error reading data:',
        error
      );
      expect(result).toBeNull();
    });
  });

  describe('removeData', () => {
    it('should remove data successfully', async () => {
      const key = 'testKey';

      await removeData(key);

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(key);
    });

    it('should handle errors when removing data', async () => {
      const key = 'testKey';
      const error = new Error('Removal error');

      AsyncStorage.removeItem.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await removeData(key);

      expect(console.error).toHaveBeenCalledWith(
        'Error removing data:',
        error
      );
    });
  });

  describe('Integration scenarios', () => {
    it('should handle complete data lifecycle', async () => {
      const key = 'user';
      const userData = { id: 1, name: 'John Doe', email: 'john@example.com' };

      // Store data
      await setData(key, userData);
      expect(AsyncStorage.setItem).toHaveBeenCalled();

      // Retrieve data
      AsyncStorage.getItem.mockResolvedValueOnce(
        JSON.stringify(userData)
      );
      const retrieved = await getData(key);
      expect(retrieved).toEqual(userData);

      // Remove data
      await removeData(key);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(key);
    });

    it('should handle multiple keys independently', async () => {
      const key1 = 'user';
      const key2 = 'settings';
      const data1 = { id: 1 };
      const data2 = { theme: 'dark' };

      await setData(key1, data1);
      await setData(key2, data2);

      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });
});
