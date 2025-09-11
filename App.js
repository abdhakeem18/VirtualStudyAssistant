import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./assets/css/global.css";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import HomeScreen from "./screens/HomeScreen";
import DetailsScreen from "./screens/DetailsScreen";
import FlashCardScreen from "./screens/FlashCardScreen";
import QA from "./screens/components/common/QA";
import QAScreen from "./screens/QAScreen";
import EmailConfirmation from "./screens/components/common/EmailConfirmation";
import {getData} from "./screens/components/utils/storage";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator();

// sk-f7ef0270cedd4bf49327724cb7a499a1


function RootStack({ initialRoute }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MaterialDetails" component={DetailsScreen} />
      <Stack.Screen name="FlashCard" component={FlashCardScreen} />
      <Stack.Screen name="QAScreen" component={QAScreen} />
      <Stack.Screen name="EmailConfirmation" component={EmailConfirmation} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = React.useState(null);

  React.useEffect(() => {
    async function fetchUser() {
      const user = await getData("user");
      
      setInitialRoute(user?.emailConfirmed ? "Home" : "Login");
    }
    fetchUser();
  }, []);

  if (!initialRoute) {
    return (
      <GestureHandlerRootView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootStack initialRoute={initialRoute} />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
