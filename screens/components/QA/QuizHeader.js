import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function QuizHeader({ streak, maxStreak, current, total, onReattempt }) {
  return (
    <View className="flex-row justify-between items-center px-4 pt-8 pb-2">
      <Text className="font-bold text-lg text-slate-700">Q&A Exam</Text>
      <View className="flex-row items-center">
        <Text className="text-xs text-gray-500 mr-4">
          Streak: {streak} 🔥 | Max: {maxStreak}
        </Text>
        <Text className="text-xs text-gray-500 mr-4">
          {current + 1} / {total}
        </Text>
        <TouchableOpacity
          className="bg-purple-900 px-3 py-2 rounded-md"
          onPress={onReattempt}
        >
          <Text className="text-white text-xs">Reattempt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
