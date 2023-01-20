import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Constants from "expo-constants";
import { View, StyleSheet } from "react-native";
import Logo from "../components/Logo/Logo";
import { useState } from "react";

// Own Dependencies
import AddPostScreen from "../screens/AddPostScreen";
import HomeScreen from "../screens/HomeScreen";
import colors from "../themes/colors";
import BottomTabItem from "../components/UI/Tab/BottomTabItem";
import ProfileNavigator from "./ProfileNavigator";
import SearchScreen from "../screens/SearchScreen";
import LogoutScreen from "../screens/LogoutScreen";
import SearchNavigator from "./SearchNavigator";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const [currentRoute, setCurrentRoute] = useState(null);

  return (
    <Tab.Navigator
      screenOptions={{
        header: (props) => {
          if (props.route.name !== "Profile") {
            return (
              <View style={styles.header}>
                <Logo width="100" height="30" styles={styles.logo} />
              </View>
            );
          }
        },
      }}
    >
      <Tab.Screen
        component={HomeScreen}
        name="Home"
        listeners={({ route }) => ({
          focus: () => {
            setCurrentRoute(route.name);
          },
        })}
        options={{
          ...BottomTabItem(currentRoute, "home", "Home", "Home", "entypo"),
        }}
      />
      <Tab.Screen
        component={AddPostScreen}
        name="Add Post"
        listeners={({ navigation, route }) => ({
          focus: () => {
            setCurrentRoute(route.name);
          },
        })}
        options={{
          ...BottomTabItem(
            currentRoute,
            "post-add",
            "Add Post",
            "Add Post",
            "material-design"
          ),
        }}
      />
      <Tab.Screen
        component={ProfileNavigator}
        name="Profile"
        listeners={({ navigation, route }) => ({
          focus: () => {
            setCurrentRoute(route.name);
          },
          tabPress: (e) =>
            navigation.jumpTo("Profile", { screen: "Profile Info" }),
        })}
        options={{
          ...BottomTabItem(
            currentRoute,
            "user",
            "Profile",
            "Profile",
            "entypo"
          ),
        }}
      />

      <Tab.Screen
        component={SearchNavigator}
        name="Search"
        listeners={({ navigation, route }) => ({
          focus: () => {
            setCurrentRoute(route.name);
          },
          tabPress: (e) =>
            navigation.jumpTo("Search", { screen: "Search Users" }),
        })}
        options={{
          ...BottomTabItem(
            currentRoute,
            "person-search",
            "Search",
            "Explore",
            "material-design"
          ),
        }}
      />

      <Tab.Screen
        component={LogoutScreen}
        name="Logout"
        listeners={({ route }) => ({
          focus: () => {
            setCurrentRoute(route.name);
          },
        })}
        options={{
          ...BottomTabItem(
            currentRoute,
            "logout",
            "Logout",
            "Logout",
            "material-design",
            true
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderBottomColor: "#8087AE",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 10,
    paddingLeft: 25,
  },
});

export default AppNavigator;
