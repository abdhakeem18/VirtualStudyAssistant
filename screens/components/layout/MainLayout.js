import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { getData, removeData } from "../utils/storage";
import { useNavigation } from "@react-navigation/native";

export default function MainLayout({ children, goBack = true }) {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();
  
  useEffect(() => {
    async function fetchUser() {
      const userData = await getData("user");
      setUser(userData);
    }
    fetchUser();
  }, []);

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
    </View>
  );
}
