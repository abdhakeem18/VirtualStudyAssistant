import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import ProfileLayout from "./components/layout/ProfileLayout";
import { getData, setData } from "../utils/storage";
import { Picker } from "@react-native-picker/picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ChangePassword from "./components/common/ChangePassword";
import API from "../config/api";

export default function ProfileScreen() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [message, setMessage] = useState("");

  const currentYear = new Date().getFullYear();
  const years = [];

  for (let year = 1980; year <= currentYear; year++) {
    years.push(year);
  }

  useEffect(() => {
    async function fetchProfile() {
      const user = await getData("user");
      if (user) {
        setProfile({
          ...user,
          birth: user?.birth ? user?.birth : "",
          gender: user?.gender ? user?.gender : "",
        });
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const apiv = API("v1");
      const response = await apiv.put("/user/" + profile.id, {
        username: profile.username,
        email: profile.email,
        phone: profile.phone,
        birth: profile.birth,
        gender: profile.gender,
      });

      if (response.data.success) {
        await setData("user", { ...profile });
        setMessage({ success: "Your profile has been updated." });
        setEditing(false);
      } else {
        setMessage({
          error: response.data.message || "Failed to update profile",
        });
      }
    } catch (error) {
      setMessage({
        error: error.message || "Error updating profile on server.",
      });
    }
  };

  return (
    <ProfileLayout message={message} setMessage={setMessage}>
      <View className="flex-1 px-6 py-8 pt-20 flex justify-center">
        {!changePasswordVisible ? (
          <>
            <View className="items-center mb-4">
              <View
                className="w-28 h-28 text-xl font-bold bg-black rounded-full text-center flex items-center justify-center"
                style={{ position: "relative" }}
              >
                <Text className="text-white font-bold text-6xl">x</Text>
              </View>
              {!editing && (
                <TouchableOpacity
                  className="bg-purple-700 px-1 py-1 rounded-full absolute bottom-0 right-40"
                  onPress={() => setEditing(true)}
                >
                  <MaterialCommunityIcons
                    name="pencil"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              )}
            </View>
            <Text className="text-xl font-bold mb-6 text-center">
              Edit Profile
            </Text>
            <View className="space-y-3">
              <TextInput
              
                value={profile?.username}
                editable={editing}
                onChangeText={(text) =>
                  setProfile({ ...profile, username: text })
                }
                placeholder="Username"
                className="bg-black/5 bg-gray-100 p-4 rounded-lg"
              />
              <TextInput
                value={profile?.email}
                editable={editing}
                onChangeText={(text) => setProfile({ ...profile, email: text })}
                placeholder="Email"
                keyboardType="email-address"
                className="bg-black/5 bg-gray-100 p-4 rounded-lg"
              />
              <TextInput
                value={profile?.phone}
                editable={editing}
                onChangeText={(text) => setProfile({ ...profile, phone: text })}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                className="bg-black/5 bg-gray-100 p-4 rounded-lg"
              />
              {/* Birth Picker */}
              <View className="bg-gray-100 rounded-lg">
                <Picker
                  enabled={editing}
                  selectedValue={profile?.birth}
                  onValueChange={(value) =>
                    setProfile({ ...profile, birth: value })
                  }
                  style={{ height: 50 }}
                >
                  <Picker.Item label="Birth" value="" />
                  {years.map((year) => (
                    <Picker.Item
                      key={year}
                      label={year.toString()}
                      value={year.toString()}
                    />
                  ))}
                </Picker>
              </View>
              {/* Gender Picker */}
              <View className="bg-gray-100 rounded-lg">
                <Picker
                  enabled={editing}
                  selectedValue={profile?.gender}
                  onValueChange={(value) =>
                    setProfile({ ...profile, gender: value })
                  }
                  style={{ height: 50 }}
                >
                  <Picker.Item label="Gender" value="" />
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              className="bg-purple-800 mt-8 py-3 rounded-lg flex-row items-center justify-center"
              onPress={() => {
                setChangePasswordVisible(true);
              }}
            >
              <Text className="text-white font-bold text-lg">
                Change Password
              </Text>
              <Text style={{ marginLeft: 8 }}>
                <MaterialCommunityIcons name="lock" size={24} color="gold" />
              </Text>
            </TouchableOpacity>
            <View className="flex-row mt-8 space-x-4 justify-center">
              {editing && (
                <>
                  <TouchableOpacity
                    className="bg-purple-700 px-6 py-3 mr-4 rounded-lg"
                    onPress={handleSave}
                  >
                    <Text className="text-white font-bold">Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-gray-400 px-6 py-3 rounded-lg"
                    onPress={() => setEditing(false)}
                  >
                    <Text className="text-white font-bold">Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        ) : (
          <ChangePassword
            visible={changePasswordVisible}
            onClose={() => setChangePasswordVisible(false)}
            setMessage={setMessage}
          />
        )}
      </View>
    </ProfileLayout>
  );
}
