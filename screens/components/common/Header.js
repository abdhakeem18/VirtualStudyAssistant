import { View, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Header({ goBack, user, navigation }) {

  return (
    <View
      className={
        goBack
          ? "flex flex-row justify-between mr-4 space-y-4 mt-16 items-start pb-3"
          : "flex flex-row justify-between mx-4 space-y-4 mt-16 items-start pb-3"
      }
    >
      <Text className="text-2xl font-bold text-slate-800 mb-2 text-start">
        {goBack ? (
          <TouchableOpacity
            className="w-16 items-center justify-center h-20 pt-2"
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="purple"
            />
          </TouchableOpacity>
        ) : null}
        <MaterialCommunityIcons
          name="book-arrow-up-outline"
          size={24}
          color="purple"
        />{" "}
        AI Study Assistant
      </Text>
      <View className="avatar avatar-placeholder">
        
        <View className="mx-5 rounded-3xl w-12 h-12 bg-purple-900">
          <Text className="text-white text-3xl font-bold text-center py-1">
            {user?.username?.charAt(0)}
          </Text>
        </View>

        
      </View>
    </View>
  );
}
