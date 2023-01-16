import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Constants from "expo-constants";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { View, StyleSheet, Text } from "react-native";
import Logo from "../components/Logo/Logo";
import { useEffect, useState } from "react";

// Own Dependencies
import AddPostScreen from "../screens/AddPostScreen";
import HomeScreen from "../screens/HomeScreen";
import colors from "../themes/colors";
import TabItem from "../components/UI/Tab/TabItem";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const [currentRoute, setCurrentRoute] = useState(null);

  return (
    <Tab.Navigator
      screenOptions={{
        header: () => (
          <View style={styles.header}>
            <Logo width="100" height="30" styles={styles.logo} />
          </View>
        ),
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
          ...TabItem(currentRoute, "home", "Home", "Home", "entypo"),
        }}
      />
      <Tab.Screen
        component={AddPostScreen}
        name="Add Post"
        listeners={({ route }) => ({
          focus: () => {
            setCurrentRoute(route.name);
          },
        })}
        options={{
          ...TabItem(
            currentRoute,
            "post-add",
            "Add Post",
            "Add Post",
            "material-design"
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
