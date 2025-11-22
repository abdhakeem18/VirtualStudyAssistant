import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { getData, removeData } from "../../../utils/storage";
import { useNavigation } from "@react-navigation/native";
import ToastPopup from "../common/toastPopup";

export default function MainLayout({
  children,
  goBack = true,
  message,
  setMessage,
}) {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    async function fetchUser() {
      const userData = await getData("user");
      if (!userData) {
        navigation.navigate("Login");
      }
      setUser(userData);
    }
    fetchUser();
  }, [message?.error]);

  return (
    <View className="bg-white w-full flex-1 relative">
      <StatusBar style="dark" />
      <Header goBack={goBack} user={user} navigation={navigation} />
      {children}
      <Footer
        logout={async () => {
          console.log("Logging out...");
          await removeData("user");
          navigation.navigate("Login");
        }}
        navigation={navigation}
      />
      <ToastPopup message={message} setMessage={setMessage} />
    </View>
  );
}
