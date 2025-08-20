import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function QuizQuestion({ question, options, selected, hiddenOptions, onSelect }) {
  return (
    <View className="w-full">
      <Text className="mb-4 text-base font-semibold">{question}</Text>
      {options.map((opt, idx) =>
        hiddenOptions.includes(idx) ? null : (
          <TouchableOpacity
            key={idx}
            className={`mb-2 px-4 py-3 rounded-md border ${
              selected === idx
                ? idx === options.findIndex(o => o.correct)
                  ? "bg-green-200 border-green-500"
                  : "bg-red-200 border-red-500"
                : "bg-gray-100 border-gray-300"
            }`}
            onPress={() => onSelect(idx)}
            disabled={selected !== null}
          >
            <Text className="text-base text-gray-800">{opt.text}</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
}
