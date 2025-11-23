import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import API from "../config/api";
import { useNavigation } from "@react-navigation/native";
import LoginLayout from "./components/layout/LoginLayout";
import Button from "./components/common/Button";
import EmailConfirmation from "./components/common/EmailConfirmation";

export default function SignupScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  // Signup handler
  const handleSignup = async () => {
    setMessage(null);
    if (!username || !email || !phone || !password || !confirmPassword) {
      setMessage({ error: "Please fill all fields." });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ error: "Passwords do not match." });
      return;
    }
    try {
      const apiv = API("v1");
      const response = await apiv.post("/auth/signup", {
        username,
        email,
        phone,
        password,
      });

      if (response.data.accessToken) {
        setMessage({
          success:
            "Signup successful! Please check your email to confirm your account.",
        });

        setTimeout(() => navigation.replace("Login"), 3000);
      } else {
        setMessage({
          error: response.data.message || "Signup failed",
        });
      }
    } catch (err) {
      console.log("err => ", err);
      setMessage({ error: err?.message });
    }
  };

  return (
    <LoginLayout message={message} setMessage={setMessage}>
      <View
        className="h-full w-full flex justify-center pt-20"
        style={{ zIndex: 1 }}
      >
        {/* Title */}
        <Animated.View
          entering={FadeInUp.duration(1000).springify()}
          className="flex items-center"
        >
          <Text className="font-bold tracking-wider text-5xl mb-16">
            Sign Up
          </Text>
        </Animated.View>
        <View className="flex items-center mx-4 space-y-4">
          <Animated.View
            entering={FadeInDown.duration(1000).springify()}
            className="bg-black/5 py-2 px-5 rounded-2xl w-full mb-3"
          >
            <TextInput
              className="bg-black/5"
              placeholder="Username"
              placeholderTextColor={"gray"}
              value={username}
              onChangeText={setUsername}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(200).duration(1000).springify()}
            className="bg-black/5 py-2 px-5 rounded-2xl w-full mb-3"
          >
            <TextInput
              className="bg-black/5"
              placeholder="Email"
              placeholderTextColor={"gray"}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            className="bg-black/5 py-2 px-5 rounded-2xl w-full mb-3"
          >
            <TextInput
              className="bg-black/5"
              placeholder="Phone No"
              placeholderTextColor={"gray"}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(600).duration(1000).springify()}
            className="bg-black/5 py-2 px-5 rounded-2xl w-full mb-3"
          >
            <TextInput
              className="bg-black/5"
              style={{color: '#000'}}
              placeholder="Password"
              placeholderTextColor={"gray"}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(800).duration(1000).springify()}
            className="bg-black/5 py-2 px-5 rounded-2xl w-full mb-3"
          >
            <TextInput
              className="bg-black/5"
              style={{color: '#000'}}
              placeholder="Confirm Password"
              placeholderTextColor={"gray"}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(1000).duration(1000).springify()}
            className="w-full"
          >
            <Button
              name={"SignUp"}
              callback={handleSignup}
              btnCls={"bg-purple-950 p-3 rounded-2xl mb-3"}
              textCls={"text-xl font-bold text-white text-center"}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInDown.delay(1200).duration(1000).springify()}
            className="flex-row justify-center"
          >
            <Text>Already have an account? </Text>
            <Button
              name={"Login"}
              callback={() => {
                navigation.push("Login");
              }}
            />
          </Animated.View>
        </View>
      </View>
    </LoginLayout>
  );
}
