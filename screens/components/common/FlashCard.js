import React from "react";
import { View, Text } from "react-native";

export default function FlashCard({ flashcards }) {
  return (
    <View className="mb-2">
      <Text className="mb-2 text-black font-bold">Flash Cards:</Text>
      {flashcards.map((card, idx) => (
        <Text key={idx} className="mb-1 text-gray-700">{card}</Text>
      ))}
    </View>
  );
}
