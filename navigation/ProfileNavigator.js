import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

// Own Dependencies
import colors from "../themes/colors";
import FollowersScreen from "../screens/FollowersScreen";
import UserPostsScreen from "../screens/UserPostsScreen";
import PostDetailsScreen from "../screens/PostDetailsScreen";

const Stack = createNativeStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => {
          return (
            <View style={styles.header}>
              <AntDesign
                name="leftcircle"
                size={24}
                color="black"
                onPress={() => props.navigation.goBack()}
              />
              <Text>{props.route.name}</Text>
            </View>
          );
        },
        initialRouteName: "Posts",
      }}
    >
      <Stack.Screen component={UserPostsScreen} name="Posts" />
      <Stack.Screen component={FollowersScreen} name="Followers" />
      <Stack.Screen component={PostDetailsScreen} name="Post Details" />
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
  header: {
    justifyContent: "center",
    height: 100,
    paddingLeft: 15,
    paddingTop: 40,
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
