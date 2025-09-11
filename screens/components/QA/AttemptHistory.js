import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function AttemptHistory({ history, onReview }) {
  return (
    <View className="w-full pb-32">
      <Text className="font-bold text-lg mb-2">Attempt History</Text>
      {history.slice().reverse().map((h, idx) => (
        <View key={idx} className="mb-4 p-3 bg-slate-100 rounded-md border border-slate-200">
          <Text className="font-semibold mb-1">{new Date(h.date).toLocaleString()}</Text>
          <Text className="text-xs mb-1">Score: {h.score}% | Max Streak: {h.streak}</Text>
          <TouchableOpacity
            className="bg-purple-400 px-2 py-1 rounded-md mt-2"
            onPress={() => onReview(h.reviewAnswers)}
          >
            <Text className="text-white text-center text-xs">Review</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
