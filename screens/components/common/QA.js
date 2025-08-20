import React from "react";
import { View, Text } from "react-native";

export default function QA({ qa }) {
  return (
    <View className="mb-2">
      <Text className="mb-2 text-black font-bold">Questions & Answers:</Text>
      {qa.map((item, idx) => (
        <View key={idx} className="mb-2">
          <Text className="font-semibold text-gray-800">Q: {item.q}</Text>
          <Text className="ml-2 text-gray-700">A: {item.a}</Text>
        </View>
      ))}
    </View>
  );
}
