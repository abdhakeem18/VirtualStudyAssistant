import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function QuizResult({ score, total, maxStreak, onRestart, onReview }) {
  return (
    <View className="items-center mb-4">
      <Text className="text-2xl font-bold mb-2">Your Score: {Math.round((score / total) * 100)}%</Text>
      <Text className="mb-2">Correct Answers: {score} / {total}</Text>
      <Text className="mb-2">Max Streak: {maxStreak}</Text>
      <TouchableOpacity className="bg-purple-900 px-4 py-2 rounded-md mb-2" onPress={onRestart}>
        <Text className="text-white">Back to Start</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-purple-400 px-4 py-2 rounded-md mb-2" onPress={onReview}>
        <Text className="text-white">Review Answers</Text>
      </TouchableOpacity>
    </View>
  );
}
