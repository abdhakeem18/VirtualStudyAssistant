import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ToastPopup({ message, setMessage }) {
  // console.log('ToastPopup => ', message);
  if (!message) {
    return null;
  } else {
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  }

  const Message =
    typeof message?.error === "string" ? message.error : message.success;
  return (
    <Animated.View
      entering={FadeInDown.duration(400)}
      className={`w-[100%] flex-row items-center px-6 absolute bottom-0 left-0 right-0 z-50 py-4 ${message?.error ? 'bg-red-500' : 'bg-green-600'}`}
    >
      {message?.error ? (
        <View className="bg-white w-auto rounded-full border-2 border-red-700">
          <MaterialCommunityIcons
            name="exclamation-thick"
            size={24}
            color={"#DC2626"}
          />
        </View>
      ) : (
        <View className="bg-white w-auto rounded-full border-2 border-green-700">
          <MaterialCommunityIcons
            name="check-circle"
            size={24}
            color={"#4CAF50"}
          />
        </View>
      )}
      <Text className="text-white text-center font-bold px-3">{Message}</Text>
    </Animated.View>
  );
}
