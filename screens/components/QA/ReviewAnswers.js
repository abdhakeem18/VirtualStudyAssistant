import React from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";

export default function ReviewAnswers({ reviewAnswers, onBack }) {
  return (
    <ScrollView className="w-full">
      <Text className="font-bold text-lg mb-2">Review Answers</Text>
      {reviewAnswers.map((ans, idx) => (
        <View key={idx} className="mb-4 p-3 bg-slate-100 rounded-md border border-slate-200">
          <Text className="font-semibold mb-1">Q{idx + 1}: {ans.question}</Text>
          {ans.options.map((opt, oidx) => (
            <View key={oidx} className={`mb-1 px-2 py-1 rounded-md border ${oidx === ans.selected ? (ans.correct ? "bg-green-200 border-green-500" : "bg-red-200 border-red-500") : "bg-gray-100 border-gray-300"}`}>
              <Text className="text-sm">{opt.text}</Text>
              <Text className="text-xs text-gray-500">{opt.explanation}</Text>
            </View>
          ))}
          <Text className="text-xs mt-1">Confidence: {Math.round((ans.confidence || 0) * 100)}%</Text>
          <Text className="text-xs">{ans.correct ? "Correct" : "Incorrect"}</Text>
        </View>
      ))}
      <TouchableOpacity className="bg-purple-900 px-4 py-2 rounded-md mb-4" onPress={onBack}>
        <Text className="text-white text-center">Back to Results</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
