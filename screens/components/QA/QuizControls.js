import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

export default function QuizControls({ 
  onNext, 
  onPrevious, 
  onSubmit,
  onFiftyFifty, 
  currentQuestion = 0,
  totalQuestions = 0,
  hasNext = false,
  hasPrevious = false,
  canSubmit = false,
  fiftyFiftyUsed = false,
  timer = 0,
  // Legacy props for backward compatibility
  isLast, 
  selected, 
  fiftyUsed
}) {
  // Support both old and new API
  const showNext = hasNext || (selected !== null && selected !== undefined && !isLast);
  const showSubmit = onSubmit !== undefined && canSubmit !== false;
  const showLegacyNext = !canSubmit && selected !== null && selected !== undefined;
  const fiftyDisabled = fiftyFiftyUsed || (fiftyUsed && fiftyUsed.status);
  const showPrevious = onPrevious !== undefined;
  
  // Determine which button to show
  const shouldRenderNext = (hasNext !== false && !showSubmit) || showLegacyNext;
  const shouldRenderSubmit = showSubmit && !shouldRenderNext;
  
  return (
    <View className="flex-row justify-between items-center mb-2 p-2">
      <View className="flex-1">
        {timer > 0 && (
          <Text className="text-xs text-gray-500">Time left: {timer}s</Text>
        )}
        
        {totalQuestions > 0 && (
          <Text className="text-xs text-gray-500">
            Question {currentQuestion + 1} of {totalQuestions}
          </Text>
        )}
      </View>
      
      <View className="flex-row">
        {showPrevious && (
          <TouchableOpacity
            className={`px-3 py-2 rounded-md mr-2 ${hasPrevious ? "bg-gray-400" : "bg-gray-200"}`}
            onPress={onPrevious}
            disabled={!hasPrevious}
            accessibilityLabel="Previous question"
          >
            <Text className={hasPrevious ? "text-white text-xs" : "text-gray-400 text-xs"}>Previous</Text>
          </TouchableOpacity>
        )}
        
        {onFiftyFifty && (
          <TouchableOpacity
            className={`px-2 py-1 rounded-md mr-2 ${fiftyDisabled ? "bg-gray-300" : "bg-purple-400"}`}
            onPress={onFiftyFifty}
            disabled={fiftyDisabled}
            accessibilityLabel="50/50 lifeline"
          >
            <Text className="text-white text-xs">50/50</Text>
            {fiftyUsed && fiftyUsed.attempts !== undefined && (
              <Text className="text-white text-xs">({3 - fiftyUsed.attempts} left)</Text>
            )}
          </TouchableOpacity>
        )}
        
        {shouldRenderNext && onNext && (
          <TouchableOpacity
            className={`px-4 py-2 rounded-md ${hasNext ? "bg-blue-600" : "bg-purple-950"}`}
            onPress={onNext}
            disabled={hasNext === false && !showLegacyNext}
            accessibilityLabel={isLast ? "Finish quiz" : "Next question"}
          >
            <Text className="text-white">{isLast ? "Finish" : "Next"}</Text>
          </TouchableOpacity>
        )}
        
        {shouldRenderSubmit && onSubmit && (
          <TouchableOpacity
            className={`px-4 py-2 rounded-md ${canSubmit ? "bg-green-600" : "bg-gray-400"}`}
            onPress={onSubmit}
            disabled={!canSubmit}
            accessibilityLabel="Submit quiz"
          >
            <Text className="text-white">Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
