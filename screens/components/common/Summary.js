import React from "react";
import { View, Text } from "react-native";

export default function Summary({ summary }) {
  // Dummy data if no summary is provided
  const dummySummary =
    summary ||
    "This is a dummy summary. It provides a brief overview of the uploaded material, including key points and important concepts covered in the file.";
  return (
    <View className="mb-2">
      <Text className="mb-2 text-black font-bold">Summary:</Text>
      <Text className="mb-2 text-gray-700">{dummySummary}</Text>
    </View>
  );
}
