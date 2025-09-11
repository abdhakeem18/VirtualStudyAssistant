import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
} from "react-native-reanimated";
import { setData, getData } from "./components/utils/storage";
import { useState } from "react";
import API from "../config/api";
import { useNavigation } from "@react-navigation/native";
import LoginLayout from "./components/layout/LoginLayout";
import Button from "./components/common/Button";
import EmailConfirmation from "./components/common/EmailConfirmation";

export default function LoginScreen() {
  
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [authorizationUser, setAuthorizationUser] = useState(false);

  const signIn = async () => {
    setMessage("");

    try {
      const apiv = API("v1");
      const response = await apiv.post("/auth/login", { email, password });
      if (response?.data?.accessToken) {
        await setData("user", response.data);
        setMessage({success: "Login successful!"});
        if (response.data?.emailConfirmed) navigation.replace("Home");
        else setAuthorizationUser(true);
      } else {
        setMessage({error: response.data.message || "Login failed"});
      }
    } catch (err) {
      if (err?.error) {
        setMessage({error: err?.message});
      }
    }
  };

  useEffect(() => {
    const checkError = async () => {
      const tokenError = await getData("tokenError");
      if (tokenError) {
        setMessage({ error: tokenError });
        setData("tokenError", "");
      }
    };
    checkError();
  }, []);

  return (
    <LoginLayout message={message} setMessage={setMessage}>
      {authorizationUser ? (
        <View
          className="h-full w-full flex justify-center pt-40 pb-10"
          style={{ zIndex: 1 }}
        >
          <EmailConfirmation
            success={success}
            error={error}
            onBack={() => navigation.replace("Login")}
          />
        </View>
      ) : (
        <View
          className="h-full w-full flex justify-center pt-40 pb-10"
          style={{ zIndex: 1 }}
        >
          {/* Title */}
          <Animated.View
            entering={FadeInUp.duration(1000).springify()}
            className="flex items-center"
          >
            <Text className="font-bold tracking-wider text-5xl mb-16">
              Login
            </Text>
          </Animated.View>

          <View className="flex items-center mx-4 space-y-4">
            <Animated.View
              entering={FadeInDown.duration(1000).springify()}
              className="bg-black/5 px-5 py-2 rounded-2xl w-full mb-3"
            >
              <TextInput
                placeholder="Email"
                placeholderTextColor={"gray"}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(200).duration(1000).springify()}
              className="bg-black/5 px-5 py-2 rounded-2xl w-full mb-3"
            >
              <TextInput
                placeholder="Password"
                placeholderTextColor={"gray"}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(400).duration(1000).springify()}
              className="w-full"
            >
              <Button
                name={"Login"}
                callback={signIn}
                btnCls={"bg-purple-900 p-3 rounded-2xl mb-3"}
                textCls={"text-xl font-bold text-white text-center"}
              />
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(600).duration(1000).springify()}
              className="flex-row justify-center"
            >
              <Text>Don't have an account? </Text>
              <Button
                name="SignUp"
                callback={() => {
                  navigation.push("SignUp");
                }}
              />
            </Animated.View>
          </View>
        </View>
      )}
    </LoginLayout>
  );
}
