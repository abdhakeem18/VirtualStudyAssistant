import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import API from "../../../config/api";
import { getData } from "../../../utils/storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ChangePassword({ visible, onClose, setMessage }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    setError("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (currentPassword === newPassword) {
      setError("Password cannot be the same as the previous password");
      return;
    }
    try {
      const user = await getData("user");
      const apiv = API("v1");
      const response = await apiv.post("/auth/change-password", {
        email: user?.email,
        currentPassword,
        newPassword,
      });
      if (response.data.success) {
        setMessage({ success: "Password changed successfully." });
        onClose && onClose();
      } else {
        setError(response.data.message || "Password change failed.");
      }
    } catch (err) {
      setMessage({ error: err?.message || "Password change failed." });
    }
    setLoading(false);
  };

  return (
    <>
      {visible && (
        <View className="bg-white p-6 rounded-lg shadow-lg">
          <Text className="text-xl font-bold mb-4 text-center">
            Change Password
          </Text>
          {/* Current Password */}
          <View className="mb-3">
            <View className="flex-row items-center bg-gray-100 rounded-lg">
              <TextInput
                placeholder="Current Password"
                placeholderTextColor={"gray"}
                style={{color: '#000'}}
                secureTextEntry={!showCurrent}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                className="bg-black/5 flex-1 p-4"
              />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
                <Text style={{ padding: 10 }}>
                  {showCurrent ? (
                    <MaterialCommunityIcons
                      name="eye-off"
                      size={18}
                      color="black"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="eye"
                      size={18}
                      color="black"
                    />
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* New Password */}
          <View className="mb-3">
            <View className="flex-row items-center bg-gray-100 rounded-lg">
              <TextInput
                placeholder="New Password"
                placeholderTextColor={"gray"}
                style={{color: '#000'}}
                secureTextEntry={!showNew}
                value={newPassword}
                onChangeText={setNewPassword}
                className="bg-black/5 flex-1 p-4"
              />
              <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                <Text style={{ padding: 10 }}>
                  {showNew ? (
                    <MaterialCommunityIcons
                      name="eye-off"
                      size={18}
                      color="black"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="eye"
                      size={18}
                      color="black"
                    />
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Confirm New Password */}
          <View className="mb-3">
            <View className="flex-row items-center bg-gray-100 rounded-lg">
              <TextInput
                placeholder="Confirm New Password"
                placeholderTextColor={"gray"}
                style={{color: '#000'}}
                secureTextEntry={!showConfirm}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                className="bg-black/5 flex-1 p-4"
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Text style={{ padding: 10 }}>
                  {showConfirm ? (
                    <MaterialCommunityIcons
                      name="eye-off"
                      size={18}
                      color="black"
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="eye"
                      size={18}
                      color="black"
                    />
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {error ? (
            <Text className="text-red-500 mb-2 text-center">{error}</Text>
          ) : null}
          <TouchableOpacity
            className="bg-purple-800 py-3 rounded-lg mt-2"
            onPress={handleChangePassword}
            disabled={loading}
          >
            <Text className="text-white font-bold text-center">
              {loading ? "Changing..." : "Change Password"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="mt-4" onPress={onClose}>
            <Text className="text-center text-gray-600">Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}
