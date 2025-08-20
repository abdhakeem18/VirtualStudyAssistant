import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

export default function QuizControls({ onNext, isLast, selected, onFiftyFifty, fiftyUsed, timer }) {
  return (
    <View className="flex-row justify-between items-center mb-2">
      <Text className="text-xs text-gray-500">Time left: {timer}s</Text>
      <TouchableOpacity
        className={`px-2 py-1 rounded-md ${fiftyUsed ? "bg-gray-300" : "bg-purple-400"}`}
        onPress={onFiftyFifty}
        disabled={fiftyUsed}
      >
        <Text className="text-white text-xs">50/50</Text>
      </TouchableOpacity>
      {selected !== null && (
        <TouchableOpacity
          className="bg-purple-900 px-4 py-2 rounded-md ml-2"
          onPress={onNext}
        >
          <Text className="text-white">{isLast ? "Finish" : "Next"}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
