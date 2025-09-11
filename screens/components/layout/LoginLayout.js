import { View, Image, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import Footer from "../common/Footer";
import { getData } from "../utils/storage";
import { useNavigation } from "@react-navigation/native";
import ToastPopup from "../common/toastPopup";

export default function LoginLayout({ children, message, setMessage }) {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const userData = await getData("user");
      if (userData?.accessToken && userData?.emailConfirmed) {
        navigation.navigate("Home");
      } else {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  return (
    <View className="bg-white h-full w-full relative">
      <StatusBar style="dark" />
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Animated.Image
            entering={FadeIn.delay(200).duration(1000).springify()}
            source={require("../../../assets/images/login-bg-image.png")}
            className="h-full w-full absolute"
            style={{ zIndex: 0 }}
            resizeMode="cover"
          />

          {children}

          <Footer layout="login" navigation={navigation} />
          <ToastPopup message={message} setMessage={setMessage} />
        </>
      )}
    </View>
  );
}
