import React from "react";
import { View, Animated, Text } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function QuizFeedback({ feedbackStyle, lastCorrect }) {
  return (
    <View className="items-center mt-2 mb-2 min-h-[40px]">
      <Animated.View style={feedbackStyle}>
        {lastCorrect === true && (
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="check-circle" size={28} color="#22c55e" />
            <Text className="ml-2 text-green-600 font-bold text-lg">Correct!</Text>
          </View>
        )}
        {lastCorrect === false && (
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="close-circle" size={28} color="#ef4444" />
            <Text className="ml-2 text-red-600 font-bold text-lg">Incorrect</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}
