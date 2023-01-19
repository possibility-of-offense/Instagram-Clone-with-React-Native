import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";

// Own Dependencies
import colors from "../themes/colors";
import CommentsScreen from "../screens/CommentsScreen";
import EditUserInfoScreen from "../screens/EditUserInfoScreen";
import FollowersScreen from "../screens/FollowersScreen";
import FollowingScreen from "../screens/FollowingScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";
import ProfileHeader from "../components/UI/Header/ProfileHeader";
import PostsScreen from "../screens/PostsScreen";
import UserProfileScreen from "../screens/UserProfileScreen";

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: ProfileHeader,
        initialRouteName: "Profile Info",
      }}
    >
      <Stack.Screen component={UserProfileScreen} name="Profile Info" />
      <Stack.Screen component={PostsScreen} name="All Posts" />
      <Stack.Screen component={FollowersScreen} name="Followers" />
      <Stack.Screen component={FollowingScreen} name="Following" />
      <Stack.Screen component={EditUserInfoScreen} name="Edit User Info" />
      <Stack.Screen component={PostDetailsScreen} name="Post Details" />
      <Stack.Screen component={CommentsScreen} name="Comments" />
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
