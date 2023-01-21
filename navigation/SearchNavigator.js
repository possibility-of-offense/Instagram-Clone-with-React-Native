import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// Own Dependencies
import AnotherPostDetailsScreen from "../screens/AnotherUser/AnotherUserPostDetailsScreen";
import AnotherUserProfileScreen from "../screens/AnotherUser/AnotherUserProfileScreen";
import AnotherUserPostsScreen from "../screens/AnotherUser/AnotherUserPostsScreen";
import SearchScreen from "../screens/User/SearchScreen";

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
      <Stack.Screen
        component={AnotherUserPostsScreen}
        name="Another User Posts"
      />
    </Stack.Navigator>
  );
}

export default SearchNavigator;
