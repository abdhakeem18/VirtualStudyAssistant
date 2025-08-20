import { TouchableOpacity, Text } from "react-native";
import React from "react";

export default function Button({ name, callback, textCls, btnCls }) {
  return (
    <TouchableOpacity className={btnCls} onPress={callback}>
      <Text className={textCls ? textCls : "text-purple-700"}>{name}</Text>
    </TouchableOpacity>
  );
}
