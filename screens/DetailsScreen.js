import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import MainLayout from "./components/layout/MainLayout";
import { useNavigation } from '@react-navigation/native';
import Summary from './components/common/Summary';
import FlashCard from './components/common/FlashCard';
import QA from './components/common/QA';

const mockFiles = [
  {
    id: 1,
    name: 'Algebra.pdf',
    summary: 'This is a dummy summary for Algebra. It covers equations, variables, and basic algebraic operations.',
    flashcards: ['What is x?', 'Solve for y: 2y+3=7'],
    qa: [
      { q: 'What is a variable?', a: 'A symbol for a number we don’t know yet.' },
      { q: 'What is an equation?', a: 'A statement that two things are equal.' }
    ]
  },
  {
    id: 2,
    name: 'Physics.docx',
    summary: 'This is a dummy summary for Physics. It covers Newton’s laws and basic mechanics.',
    flashcards: ['State Newton’s First Law', 'What is force?'],
    qa: [
      { q: 'What is Newton’s First Law?', a: 'An object in motion stays in motion unless acted upon by a force.' },
      { q: 'What is force?', a: 'Force = mass x acceleration.' }
    ]
  }
];

export default function DetailsScreen({ route }) {
  const navigation = useNavigation();
  const { title } = route.params || {};
  const [expandedFileId, setExpandedFileId] = useState(null);
  const [dropdownStep, setDropdownStep] = useState('summary'); // 'summary', 'flashcard', 'qa'

  return (
    <MainLayout>
      <View className="flex flex-row w-full flex-1 px-4 pb-14">
        <View className="w-full pr-4 flex-1">
         
          <Text className="font-bold text-lg text-slate-700 mb-2">
            {title}
          </Text>
          <Text className="mb-4 text-gray-500">Uploaded Files:</Text>
          <FlatList
            data={mockFiles}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <View className="mb-4">
                <TouchableOpacity
                  className="bg-gray-100 rounded-md px-4 py-3"
                  onPress={() => {
                    setExpandedFileId(expandedFileId === item.id ? null : item.id);
                    setDropdownStep('summary');
                  }}
                >
                  <Text className="text-base text-black">{item.name}</Text>
                  <Text className="text-xs text-purple-700 mt-1">{expandedFileId === item.id ? 'Hide Options' : 'Show Options'}</Text>
                </TouchableOpacity>
                {expandedFileId === item.id && (
                  <View className="bg-white border border-gray-200 rounded-md mt-2 p-3">
                    {dropdownStep === 'summary' && (
                      <>
                        <Summary summary={item.summary} />
                        <View className="flex flex-row space-x-2 mb-2">
                          <TouchableOpacity
                            className="flex-1 bg-purple-900 rounded-md px-3 py-2 mr-2"
                            onPress={() => navigation.navigate('FlashCard', { flashcards: item.flashcards })}
                          >
                            <Text className="text-white text-center">See Flash Card</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="flex-1 bg-purple-900 rounded-md px-3 py-2"
                            onPress={() => navigation.navigate('QAScreen', { qa: item.qa, fileName: item.name })}
                          >
                            <Text className="text-white text-center">See Q&A</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                   
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </View>
    </MainLayout>
  );
}