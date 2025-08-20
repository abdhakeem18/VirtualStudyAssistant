import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import API from "../../config/api";
import Button from "./Button";

export default function SignupForm({ navigation }) {
  const [waitingForEmail, setWaitingForEmail] = useState(false);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [emailForResend, setEmailForResend] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    setError("");
    setSuccess("");
    if (!username || !email || !phone || !password || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
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
      if (response.data.success) {
        setSuccess("Signup successful! Please check your email to confirm your account.");
        setWaitingForEmail(true);
        setEmailForResend(email);
        setTimeout(() => setResendAvailable(true), 300000); // 5 minutes
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err) {
      setError("Network error or invalid data");
    }
  };

  const handleResendEmail = async () => {
    setError("");
    setSuccess("");
    try {
      const apiv = API("v1");
      const response = await apiv.post("/auth/resend-confirmation", { email: emailForResend });
      if (response.data.success) {
        setSuccess("Confirmation email resent. Please check your inbox.");
        setResendAvailable(false);
        setTimeout(() => setResendAvailable(true), 300000); // 5 minutes
      } else {
        setError(response.data.message || "Could not resend email");
      }
    } catch (err) {
      setError("Network error while resending email");
    }
  };

  return (
    <View className="flex items-center mx-4 space-y-4">
      {!waitingForEmail ? (
        <>
          {error ? (
            <Text className="text-red-500 mb-2 text-center">{error}</Text>
          ) : null}
          {success ? (
            <Text className="text-green-500 mb-2 text-center">{success}</Text>
          ) : null}
          <Animated.View entering={FadeInDown.duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full mb-3">
            <TextInput placeholder="Username" placeholderTextColor={"gray"} value={username} onChangeText={setUsername} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(200).duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full mb-3">
            <TextInput placeholder="Email" placeholderTextColor={"gray"} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(400).duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full mb-3">
            <TextInput placeholder="Phone No" placeholderTextColor={"gray"} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(600).duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full mb-3">
            <TextInput placeholder="Password" placeholderTextColor={"gray"} secureTextEntry value={password} onChangeText={setPassword} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(800).duration(1000).springify()} className="bg-black/5 p-5 rounded-2xl w-full mb-3">
            <TextInput placeholder="Confirm Password" placeholderTextColor={"gray"} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(1000).duration(1000).springify()} className="w-full">
            <Button name={"SignUp"} callback={handleSignup} btnCls={"bg-purple-900 p-3 rounded-2xl mb-3"} textCls={"text-xl font-bold text-white text-center"}/>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(1200).duration(1000).springify()} className="flex-row justify-center">
            <Text>Already have an account? </Text>
            <Button name={"Login"} callback={() => {navigation.push("Login")}} />
          </Animated.View>
        </>
      ) : (
        <>
          <Text className="text-lg font-bold text-slate-700 mb-4 text-center">Please check your email and click the confirmation link to activate your account.</Text>
          {success ? (
            <Text className="text-green-500 mb-2 text-center">{success}</Text>
          ) : null}
          {error ? (
            <Text className="text-red-500 mb-2 text-center">{error}</Text>
          ) : null}
          <Text className="text-xs text-gray-500 mb-2 text-center">If you did not receive the email, you can resend the confirmation link after 5 minutes.</Text>
          <Button
            name={resendAvailable ? "Resend Confirmation Email" : "Resend available in 5 min"}
            callback={handleResendEmail}
            btnCls={resendAvailable ? "bg-purple-900 p-3 rounded-2xl mb-3" : "bg-gray-400 p-3 rounded-2xl mb-3"}
            textCls={"text-base font-bold text-white text-center"}
            disabled={!resendAvailable}
          />
          <Button name={"Back to Login"} callback={() => navigation.replace("Login")}/>
        </>
      )}
    </View>
  );
}
