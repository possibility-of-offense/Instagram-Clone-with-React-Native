import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

// Own Dependencies
import AnotherPostDetailsScreen from "../screens/AnotherUser/AnotherUserPostDetailsScreen";
import AnotherUserProfileScreen from "../screens/AnotherUser/AnotherUserProfileScreen";
import AnotherUserPostsScreen from "../screens/AnotherUser/AnotherUserPostsScreen";
import AnotherUserCommentsScreen from "../screens/AnotherUser/AnotherUserCommentsScreen";
import FollowerScreen from "../screens/Followers_Following/FollowerScreen";
import FollowingScreen from "../screens/Followers_Following/FollowingScreen";
import SearchScreen from "../screens/User/SearchScreen";

const Stack = createNativeStackNavigator();

function SearchNavigator(props) {
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      e.preventDefault();

      props.navigation.jumpTo("Search", { screen: "Search Users" });
    });

    return unsubscribe;
  }, [props.navigation]);

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
      <Stack.Screen
        component={AnotherUserCommentsScreen}
        name="Another User Comments"
      />
      <Stack.Screen component={FollowerScreen} name="Followers" />
      <Stack.Screen
        component={FollowingScreen}
        name="Following"
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default SearchNavigator;
