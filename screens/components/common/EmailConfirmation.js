import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Button from "./Button";
import API from "../../../config/api";
import { getData, updateDataField } from "../../../utils/storage";

export default function EmailConfirmation({ message, setMessage }) {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [resendAvailable, setResendAvailable] = useState(true);
  const [emailForResend, setEmailForResend] = useState("");
  const navigation = useNavigation();
  const [timer, setTimer] = useState(60);

  const handleVerify = async () => {
    setMessage("");

    if (!otp) {
      setMessage({ error: "Please enter the OTP." });
      return;
    }
    const result = await onVerifyOtp(otp);
    if (result?.success) {
      setMessage({ success: "Email verified!" });
      await updateDataField("user", "emailConfirmed", 1);
      setTimeout(() => {
        navigation.push("Home");
      }, 2000);
    } else {
      setMessage({ error: result?.message || "Invalid OTP" });
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
      setMessage({ error: error?.message });
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
    setMessage("");
    if (resendAvailable) {
      try {
        const apiv = API("v1");
        const userData = await getData("user");
        const response = await apiv.post("/auth/resend-verification", {
          email: userData?.email,
        });
        if (response.data.success) {
          setMessage({
            success: "Confirmation email resent. Please check your inbox.",
          });
          setResendAvailable(false);
        } else {
          setMessage({
            error: response.data.message || "Could not resend email",
          });
        }
      } catch (err) {
        setMessage({ error: err?.message });
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
        <View className="flex items-center w-full">
          <Button
            name="Verify OTP"
            callback={handleVerify}
            btnCls="bg-purple-950 p-3 rounded-2xl mb-3"
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
