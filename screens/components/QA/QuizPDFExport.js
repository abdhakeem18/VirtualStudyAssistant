import React, { useState, useE } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator, Platform, PermissionsAndroid } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import API from '../../../config/api';

export default function QuizPDFExport({ docId, visible, onClose, setMessage }) {
  const [loading, setLoading] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(true);

  React.useEffect(() => {
    if (visible) {
      setShowOptionsModal(true);
      setLoading(false);
    }
  }, [visible]);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        return status === 'granted';
      } catch (err) {
        console.error('Permission error:', err);
        return false;
      }
    }
    return true;
  };

  const handleExportPDF = async (includeAnswers) => {
    try {
      setLoading(true);
      setShowOptionsModal(false);

      if (!docId || docId === 0) {
        setMessage({ error: 'Document ID is missing. Please ensure you have a valid quiz loaded.' });
        setShowOptionsModal(true);
        setLoading(false);
        return;
      }

      console.log('Exporting PDF for docId:', docId, 'includeAnswers:', includeAnswers);

      const response = await API('v1').post('/quiz/export-pdf', {
        documentId: docId,
        includeAnswers: includeAnswers,
      });

      console.log('Response:', response.data);

      if (response.data?.success) {
        const filename = response.data.fileName;
        
        if (filename) {
          console.log('Downloading PDF with filename:', filename);
          const downloadResponse = await API('v1').get(`/quiz/download-pdf/${filename}`, {
            responseType: 'arraybuffer', 
          });
          
          if (!downloadResponse.data) {
            setMessage({ error: 'Failed to download PDF file' });
            setShowOptionsModal(true);
            setLoading(false);
            return;
          }

          console.log('PDF downloaded successfully');

          // Request storage permission //
          const hasPermission = await requestStoragePermission();
          if (!hasPermission) {
            setMessage({ error: 'Storage permission is required to save PDF' });
            setShowOptionsModal(true);
            setLoading(false);
            return;
          }

          const base64 = btoa(
            new Uint8Array(downloadResponse.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          );

          const fileUri = `${FileSystem.documentDirectory}${filename}`;

          await FileSystem.writeAsStringAsync(fileUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          console.log('PDF saved to:', fileUri);

          if (Platform.OS === 'android') {
            try {
              const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
              
              if (permissions.granted) {
                const uri = await FileSystem.StorageAccessFramework.createFileAsync(
                  permissions.directoryUri,
                  filename,
                  'application/pdf'
                );

                await FileSystem.writeAsStringAsync(uri, base64, {
                  encoding: FileSystem.EncodingType.Base64,
                });

                console.log('PDF also saved to public storage:', uri);
              }
            } catch (storageError) {
              console.log('Could not save to public storage:', storageError);
            }
          }

          // Share the file //
          const isAvailable = await Sharing.isAvailableAsync();
          if (isAvailable) {
            await Sharing.shareAsync(fileUri, {
              mimeType: 'application/pdf',
              dialogTitle: 'Export Quiz PDF',
              UTI: 'com.adobe.pdf',
            });
          }

          setMessage({
            success: `Quiz PDF ${includeAnswers ? 'with answers' : 'without answers'} has been saved and exported successfully!`
          });
          
          // Reset states before closing
          setLoading(false);
          setShowOptionsModal(true);
          onClose();
        } else {
          setMessage({ error: 'PDF filename not found in response' });
          setShowOptionsModal(true);
        }
      } else {
        setMessage({ error: response.data?.message || 'Failed to generate PDF' });
        setShowOptionsModal(true);
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      console.error('Error details:', error?.response?.data || error);
      
      const errorMessage = error?.response?.data?.message 
        || error?.response?.data?.error 
        || error?.message 
        || error?.msg 
        || 'Failed to export PDF. Please try again.';
      
      setMessage({ error: errorMessage });
      setShowOptionsModal(true);
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        {showOptionsModal && !loading ? (
          <View className="bg-white rounded-xl p-6 w-80 mx-4">
            <View className="items-center mb-4">
              <MaterialCommunityIcons name="file-pdf-box" size={48} color="#7c3aed" />
              <Text className="text-xl font-bold mt-2 text-gray-800">Export Quiz PDF</Text>
              <Text className="text-sm text-gray-600 text-center mt-2">
                Choose whether to include answers in the PDF
              </Text>
            </View>

            <TouchableOpacity
              className="bg-purple-950 py-3 px-4 rounded-lg mb-3 flex-row items-center justify-center"
              onPress={() => handleExportPDF(false)}
            >
              <MaterialCommunityIcons name="file-document-outline" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">Questions Only</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-blue-950 py-3 px-4 rounded-lg mb-3 flex-row items-center justify-center"
              onPress={() => handleExportPDF(true)}
            >
              <MaterialCommunityIcons name="file-check-outline" size={20} color="white" />
              <Text className="text-white font-semibold ml-2">With Answers</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-200 py-3 px-4 rounded-lg flex-row items-center justify-center"
              onPress={onClose}
            >
              <MaterialCommunityIcons name="close" size={20} color="#374151" />
              <Text className="text-gray-700 font-semibold ml-2">Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="bg-white rounded-xl p-6 w-80 mx-4 items-center">
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text className="text-gray-700 mt-4 text-center">
              Generating PDF...
            </Text>
            <Text className="text-gray-500 text-sm mt-2 text-center">
              Please wait while we prepare your quiz PDF
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}