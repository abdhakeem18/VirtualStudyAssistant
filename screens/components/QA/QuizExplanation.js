import React from "react";
import { View, Text } from "react-native";

export default function QuizExplanation({ options, answerIdx, selectedIdx }) {
  return (
    <View className="bg-slate-100 rounded-md p-3 mb-2 border border-slate-200">
      <Text className="text-xs text-slate-500 mb-1">Explanations:</Text>
      {options.map((opt, idx) => (
        <View key={idx} className="mb-1">
          <Text
            className={`text-sm ${idx === answerIdx ? "text-green-700 font-bold" : idx === selectedIdx ? "text-red-700 font-bold" : "text-gray-700"}`}
          >
            {opt.text}: {opt.explanation}
          </Text>
        </View>
      ))}
    </View>
  );
}
