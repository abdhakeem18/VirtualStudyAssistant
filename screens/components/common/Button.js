import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import React from "react";

export default function Button({ 
  name, 
  callback, 
  textCls, 
  btnCls, 
  loading = false, 
  disabled = false 
}) {
  return (
    <TouchableOpacity 
      className={`${btnCls} ${(loading || disabled) ? 'opacity-70' : ''}`} 
      onPress={loading || disabled ? null : callback}
      disabled={loading || disabled}
    >
      <View className="flex flex-row items-center justify-center">
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={textCls?.includes('text-white') ? 'white' : '#7c3aed'} 
            style={{ marginRight: 8 }} 
          />
        )}
        <Text className={textCls ? textCls : "text-purple-700"}>
          {loading ? 'Loading...' : name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
