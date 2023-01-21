import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// Own Dependencies
import LoginScreen from "../screens/Auth/LoginScreen";

const Stack = createNativeStackNavigator();

function AuthNavigator(props) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={LoginScreen} name="Login" />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
