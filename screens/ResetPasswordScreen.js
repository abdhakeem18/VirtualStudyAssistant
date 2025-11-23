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

export default function ResetPasswordScreen({ navigation, route }) {
  const { email } = route.params || {};
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
    const [message, setMessage] = useState("");

  const handleVerifyCode = async () => {
    setMessage("");

    if (!resetCode.trim()) {
      setMessage({error: "Please enter the reset code"});
      return;
    }

    try {
      setLoading(true);
      const apiv = API("v1");
      const response = await apiv.post("/auth/reset-password", {
        email,
        resetCode,
      });

      if (response.data) {
        setMessage({success: response?.data?.message || "Code verified!"});
        setStep(2);
      }
    } catch (err) {
      setMessage({error: err?.message || "Invalid reset code. Please try again."});
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setMessage("");

    if (!newPassword.trim()) {
      setMessage({error: "Please enter a new password"});
      return;
    }

    if (newPassword.length < 6) {
      setMessage({error: "Password must be at least 6 characters"});
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({error: "Passwords do not match"});
      return;
    }

    try {
      setLoading(true);
      const apiv = API("v1");
      const response = await apiv.post("/auth/change-password", {
        email,
        resetCode,
        newPassword,
      });

      if (response.data) {
        setMessage({success: response?.data?.message || "Password reset successful!"});
        setTimeout(() => {
          navigation.navigate("Login");
        }, 800);
      }
    } catch (err) {
      setMessage({error: err?.message || "Failed to reset password. Please try again."});
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
            className="font-bold tracking-wider text-4xl mb-20"
          >
            Reset Password
          </Animated.Text>
        </View>

        <View className="flex items-center mx-4 space-y-4">
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            className="bg-black/5 p-5 rounded-2xl w-full"
          >
            {step === 1 ? (
              <>
                <View className="mb-6">
                  <Text className="text-center text-base mb-2">
                    Enter the reset code
                  </Text>
                  <Text className="/70 text-center text-sm">
                    Check your email ({email}) for the reset code
                  </Text>
                </View>

                <View className="bg-black/5 p-4 rounded-2xl w-full mb-3 flex-row items-center">
                  <TextInput
                    placeholder="Enter reset code"
                    className="bg-black/5 flex-1 "
                    value={resetCode}
                    onChangeText={(text) => {
                      setResetCode(text);
                    }}
                    keyboardType="default"
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity
                  className={`w-full py-3 rounded-xl mb-3 ${
                    !resetCode.trim() || loading
                      ? "bg-gray-500"
                      : "bg-purple-950"
                  }`}
                  onPress={handleVerifyCode}
                  disabled={!resetCode.trim() || loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-xl font-bold  text-center">
                      Verify Code
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View className="mb-6">
                  <Text className="text-center text-base mb-2">
                    Set your new password
                  </Text>
                  <Text className="text-center text-sm">
                    Password must be at least 6 characters
                  </Text>
                </View>

                <View className="bg-black/5 p-4 rounded-2xl w-full mb-3 flex-row items-center">
                  
                  <TextInput
                    placeholder="New password"
                    className="bg-black/5 flex-1 "
                    value={newPassword}
                    onChangeText={(text) => {
                      setNewPassword(text);
                    }}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  >
                    <MaterialCommunityIcons
                      name={showNewPassword ? "eye-off" : "eye"}
                      size={20}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>

                <View className="bg-black/5 p-4 rounded-2xl w-full mb-3 flex-row items-center">
                  <TextInput
                    placeholder="Confirm new password"
                    className="bg-black/5 flex-1 "
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                    }}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <MaterialCommunityIcons
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={20}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  className={`w-full py-3 rounded-xl mb-3 ${
                    !newPassword.trim() || !confirmPassword.trim() || loading
                      ? "bg-gray-500"
                      : "bg-purple-950"
                  }`}
                  onPress={handleResetPassword}
                  disabled={
                    !newPassword.trim() || !confirmPassword.trim() || loading
                  }
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white text-xl font-bold  text-center">
                      Reset Password
                    </Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Back to Login */}
            <View className="flex-row justify-center items-center">
              <Text className="">Remember your password? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text className="text-purple-950 font-semibold">
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
