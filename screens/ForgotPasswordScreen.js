import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import API from "../config/api";
import LoginLayout from "./components/layout/LoginLayout";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendResetCode = async () => {
    setMessage("");

    if (!email.trim()) {
      setMessage({error: "Please enter your email address"});
      return;
    }

    if (!validateEmail(email)) {
      setMessage({error: "Please enter a valid email address"});
      return;
    }

    try {
      setLoading(true);
      const apiv = API("v1");
      const response = await apiv.get(`/auth/forgot-password?email=${email}`);

      if (response.data.message) {
        setMessage({success: response?.data?.message});
        setTimeout(() => {
          navigation.navigate("ResetPassword", { email });
        }, 800);
      }
    } catch (err) {
      setMessage({error: err?.message || "Failed to send reset code. Please try again."});
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginLayout message={message} setMessage={setMessage}>
      <View className="h-full w-full flex justify-center pb-10">
        <View className="flex items-center">
          <Animated.Text
            entering={FadeInDown.duration(1000).springify()}
            className="font-bold tracking-wider text-4xl mb-24"
          >
            Forgot Password
          </Animated.Text>
        </View>

        <View className="flex items-center mx-4 space-y-4">
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            <View className="mb-6">
              <Text className="text-center text-base mb-2">
                Enter your registered email address
              </Text>
              <Text className="text-center text-sm">
                We will send a password reset code to your email
              </Text>
            </View>

            <View className="bg-black/5 p-4 rounded-2xl w-full mb-3 flex-row items-center">
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor={"gray"}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                }}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <TouchableOpacity
              className={`w-full py-3 rounded-xl mb-3 ${
                !email.trim() || loading ? "bg-gray-500" : "bg-purple-800"
              }`}
              onPress={handleSendResetCode}
              disabled={!email.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-xl font-bold text-white text-center">
                  Send Reset Code
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center">
              <Text className="text-white">Remember your password? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-purple-800 font-semibold">
                  Back to Login
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
    </LoginLayout>
  );
}
