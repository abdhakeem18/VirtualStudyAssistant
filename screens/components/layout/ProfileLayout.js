import { View, Image, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import Footer from "../common/Footer";
import { getData } from "../utils/storage";
import { useNavigation } from "@react-navigation/native";

export default function LoginLayout({ children }) {
  const navigation = useNavigation();

  return (
    <View className="bg-white h-full w-full relative">
      <StatusBar style="dark" />
      <Animated.Image
        entering={FadeIn.delay(200).duration(1000).springify()}
        source={require("../../../assets/images/login-bg-image.png")}
        className="h-full w-full absolute"
        style={{ zIndex: 0 }}
        resizeMode="cover"
      />

      {children}

      <Footer navigation={navigation} />
    </View>
  );
}
