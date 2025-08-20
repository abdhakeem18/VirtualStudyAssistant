import { View, Text, Image } from "react-native";
import React from "react";


export default function Card({ title, imageSource }) {
  return (
    <View className="flex-row items-center bg-gray-50 elevation-sm rounded-lg h-28 mb-4">
      <Image
        source={imageSource}
        className="w-20 h-full rounded-md"
        resizeMode="cover"
      />
      <Text className="ml-4 text-slate-800 text-base">{title}</Text>
    </View>
  );
}
