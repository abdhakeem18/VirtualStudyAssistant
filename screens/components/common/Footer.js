import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Footer({ layout, logout, navigation }) {

  return (
    <>
      {!layout ? (
        <View className="absolute bottom-0 left-0 right-0 bg-purple-900 p-4 shadow-lg">
          <View className="flex flex-row justify-between px-10">
            <TouchableOpacity
              className="items-center justify-center"
              onPress={async () => {
                navigation.navigate("Profile");
              }}
            >
              <MaterialCommunityIcons name="account" size={35} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center justify-center bg-purple-900 rounded-full flex p-5 absolute left-2/4 bottom-0 border-8 border-white shadow-2xl"
              onPress={async () => {
                navigation.navigate("Home");
              }}
            >
              <MaterialCommunityIcons name="home" size={35} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              className="items-center justify-center"
              onPress={logout}
            >
              <MaterialCommunityIcons name="logout" size={35} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-lg opacity-70">
          <Text className="text-center text-black">
            All Rights Reserved &copy; 2025 Virtual Study Assistant
          </Text>
        </View>
      )}
    </>
  );
}
