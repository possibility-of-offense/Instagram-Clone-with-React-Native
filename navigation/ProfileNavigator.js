import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";

// Own Dependencies
import colors from "../themes/colors";
import AnotherUserProfileScreen from "../screens/AnotherUser/AnotherUserProfileScreen";
import CommentsScreen from "../screens/User/CommentsScreen";
import EditUserInfoScreen from "../screens/User/EditUserInfoScreen";
import FollowersScreen from "../screens/Followers_Following/FollowerScreen";
import FollowingScreen from "../screens/Followers_Following/FollowingScreen";
import PostDetailsScreen from "../screens/User/PostDetailsScreen";
import ProfileHeader from "../components/UI/Header/ProfileHeader";
import PostsScreen from "../screens/User/PostsScreen";
import UserProfileScreen from "../screens/User/UserProfileScreen";

const Stack = createNativeStackNavigator();

const ProfileNavigator = (props) => {
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      e.preventDefault();

      props.navigation.jumpTo("Profile", { screen: "Profile Info" });
    });

    return unsubscribe;
  }, [props.navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        header: ProfileHeader,
        initialRouteName: "Profile Info",
      }}
    >
      <Stack.Screen component={UserProfileScreen} name="Profile Info" />
      <Stack.Screen component={PostsScreen} name="All Posts" />
      <Stack.Screen
        component={FollowersScreen}
        name="Followers"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        component={FollowingScreen}
        name="Following"
        options={{ headerShown: false }}
      />
      <Stack.Screen component={EditUserInfoScreen} name="Edit Profile" />
      <Stack.Screen component={PostDetailsScreen} name="Post Details" />
      <Stack.Screen component={CommentsScreen} name="Comments" />
      <Stack.Screen
        component={AnotherUserProfileScreen}
        name="Another User Profile Info"
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  btn: {
    backgroundColor: colors.grey,
    marginTop: 15,
    flex: 1,
  },
  btnText: {
    color: colors.dark,
  },
  userInfoContainer: {
    flexDirection: "row",
    padding: 25,
  },
  userInfoImage: {
    borderRadius: 40,
    height: 80,
    width: 80,
  },
  userInfoNameContainer: {
    flex: 1,
    marginLeft: 30,
    marginTop: 10,
    marginRight: 5,
  },
  userInfoName: {
    fontSize: 18,
  },
});

export default ProfileNavigator;
