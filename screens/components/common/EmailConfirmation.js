import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Button from "./Button";
import API from "../../../config/api";
import { getData, updateDataField } from "../utils/storage";

export default function EmailConfirmation({ success, error, onBack }) {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [resendAvailable, setResendAvailable] = useState(true);
  const [emailForResend, setEmailForResend] = useState("");
  const navigation = useNavigation();
  const [timer, setTimer] = useState(60);

  const handleVerify = async () => {
    setOtpError("");
    setOtpSuccess("");
 
    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }
    const result = await onVerifyOtp(otp);
    if (result?.success) {
      setOtpSuccess("Email verified!");
      await updateDataField("user", "emailConfirmed", 1);
      navigation.push("Home");
    } else {
      setOtpError(result?.message || "Invalid OTP");
    }
  };

  const onVerifyOtp = async (otp) => {
    try {
      const userData = await getData("user");
      const apiv = API("v1");
      const response = await apiv.post("/auth/confirm-email", {
        otp,
        email: userData?.email,
      });
      return response.data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    let interval;
    if (!resendAvailable) {
      setTimer(60);
      interval = setInterval(() => {
        setTimer((prev) => {
          // console.log('prev => ', prev);
          if (prev <= 1) {
            clearInterval(interval);
            setResendAvailable(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendAvailable]);

  const handleResendEmail = async () => {
    setOtpError("");
    setOtpSuccess("");
    if (resendAvailable) {
      try {
        const apiv = API("v1");
        const userData = await getData("user");
        const response = await apiv.post("/auth/resend-verification", {
          email: userData?.email,
        });
        if (response.data.success) {
          setOtpSuccess("Confirmation email resent. Please check your inbox.");
          setResendAvailable(false);
        } else {
          setOtpError(response.data.message || "Could not resend email");
        }
      } catch (err) {
        setOtpError(err?.message);
      }
    }
  };

  return (
    <>
      <TouchableOpacity
        className="w-16 items-left h-20 pt-2 fixed left-7 -top-10"
        onPress={() => navigation.push("Login")}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="purple" />
      </TouchableOpacity>
      <View className="flex items-center mx-4 space-y-4">
        <Text className="text-lg font-bold text-slate-700 mb-2">
          Email Confirmation
        </Text>
        <Text className="mb-2 text-gray-700 text-center">
          Please enter the OTP sent to your email to verify your account.
        </Text>
        <TextInput
          placeholder="Enter OTP"
          placeholderTextColor="gray"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          className="bg-black/5 p-5 rounded-2xl w-full mb-3 text-center"
          maxLength={6}
        />
        {otpError ? (
          <Text className="text-red-500 mb-2 text-center">{otpError}</Text>
        ) : null}
        {otpSuccess ? (
          <Text className="text-green-500 mb-2 text-center">{otpSuccess}</Text>
        ) : null}
        {error ? (
          <Text className="text-red-500 mb-2 text-center">{error}</Text>
        ) : null}
        {success ? (
          <Text className="text-green-500 mb-2 text-center">{success}</Text>
        ) : null}
        <View className="flex items-center w-full">
          <Button
            name="Verify OTP"
            callback={handleVerify}
            btnCls="bg-purple-900 p-3 rounded-2xl mb-3"
            textCls="text-xl font-bold text-white text-center"
          />

          <Button
            name={resendAvailable ? "Resend OTP" : `Resend OTP (${timer}s)`}
            callback={handleResendEmail}
            disabled={!resendAvailable}
          />
        </View>
      </View>
    </>
  );
}
