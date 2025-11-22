import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function QuizResult({ 
  score, 
  total, 
  totalQuestions,
  correctAnswers,
  maxStreak,
  streak,
  bestScore,
  onRestart, 
  onReview 
}) {
  // Support both old and new API
  const actualTotal = totalQuestions || total;
  const actualCorrect = correctAnswers !== undefined ? correctAnswers : score;
  const actualStreak = streak !== undefined ? streak : maxStreak;
  
  const percentage = actualTotal > 0 ? Math.round((actualCorrect / actualTotal) * 100) : 0;
  
  // Determine grade
  let grade = 'F';
  if (percentage >= 90) grade = 'A';
  else if (percentage >= 80) grade = 'B';
  else if (percentage >= 70) grade = 'C';
  else if (percentage >= 60) grade = 'D';
  
  // Determine message
  let message = '';
  if (percentage === 100) {
    message = '🎉 Perfect Score! Outstanding!';
  } else if (percentage >= 80) {
    message = '✨ Excellent work!';
  } else if (percentage >= 60) {
    message = '👍 Great job!';
  } else {
    message = '💪 Keep practicing!';
  }
  
  // Check for new best (percentage > bestScore, not >=)
  const isNewBest = bestScore !== undefined && percentage > bestScore;
  
  return (
    <View className="items-center mb-4">
      <View accessibilityLabel="Quiz score">
        <Text className="text-2xl font-bold mb-2 text-center">
          Your Score: {percentage}%
        </Text>
      </View>
      
      <Text className="text-lg mb-1">Grade: {grade}</Text>
      <Text className="text-base mb-2" testID="result-message">{message}</Text>
      
      <Text className="mb-2" testID="correct-answers">
        Correct Answers: {actualCorrect} / {actualTotal}
      </Text>
      
      {actualStreak !== undefined && (
        <Text className="mb-2">Max Streak: {actualStreak}</Text>
      )}
      
      {bestScore !== undefined && !isNewBest && (
        <Text className="mb-2">Best Score: {bestScore}%</Text>
      )}
      
      {isNewBest && (
        <Text className="text-green-600 font-bold mb-2">
          🎊 New Personal Best! ({bestScore}% → {percentage}%)
        </Text>
      )}
      
      <TouchableOpacity 
        className="bg-purple-950 px-4 py-2 rounded-md mb-2" 
        onPress={onRestart}
      >
        <Text className="text-white">Back to Start</Text>
      </TouchableOpacity>
      
      {onReview && (
        <TouchableOpacity 
          className="bg-purple-400 px-4 py-2 rounded-md mb-2" 
          onPress={onReview}
        >
          <Text className="text-white">Review Answers</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
