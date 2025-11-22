import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function QuizQuestion(props) {
  const {
    question,
    options: optionsProp,
    selected,
    selectedOption,
    hiddenOptions = [],
    onSelect,
    onSelectOption,
    lastCorrect,
    currentQuestion,
    totalQuestions,
    disabled = false
  } = props;
  
  // Support both APIs
  const isObjectQuestion = question && typeof question === 'object' && question.question;
  const actualQuestion = isObjectQuestion ? question.question : question;
  const actualOptions = isObjectQuestion ? question.options : (optionsProp || []);
  const actualSelected = selectedOption !== undefined ? selectedOption : selected;
  const handleSelect = onSelectOption || onSelect || (() => {});
  
  return (
    <View className="w-full">
      {totalQuestions > 0 && (
        <Text className="text-sm text-gray-500 mb-2">
          Question {currentQuestion + 1} of {totalQuestions}
        </Text>
      )}
      <Text className="mb-4 text-base font-semibold">{actualQuestion}</Text>
      {actualOptions.map((opt, idx) => {
        // Support both string and object options
        const optionText = typeof opt === 'string' ? opt : opt.text;
        
        if (hiddenOptions.includes(idx)) {
          return null;
        }
        
        return (
          <TouchableOpacity
            key={idx}
            className={`mb-2 px-4 py-3 rounded-md border ${
              actualSelected === idx
                ? idx === lastCorrect
                  ? "bg-green-200 border-green-500"
                  : "bg-red-200 border-red-500"
                : "bg-gray-100 border-gray-300"
            }`}
            onPress={() => handleSelect(idx)}
            disabled={disabled || actualSelected !== null}
          >
            <Text className="text-base text-gray-800">{optionText}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
