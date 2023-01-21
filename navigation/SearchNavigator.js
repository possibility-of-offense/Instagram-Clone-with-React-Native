import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AnotherPostDetailsScreen from "../screens/AnotherUser/AnotherPostDetailsScreen";
import AnotherUserProfileScreen from "../screens/AnotherUser/AnotherUserProfileScreen";

// Own Dependencies
import SearchScreen from "../screens/SearchScreen";

const Stack = createNativeStackNavigator();

function SearchNavigator(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={SearchScreen}
        name="Search Users"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={AnotherUserProfileScreen}
        name="Another User"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={AnotherPostDetailsScreen}
        name="Another Post Details"
      />
    </Stack.Navigator>
  );
}

export default SearchNavigator;
