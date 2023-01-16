import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Constants from "expo-constants";
import { View, StyleSheet, Text } from "react-native";
import Logo from "../components/Logo/Logo";

// Own Dependencies
import AddPostScreen from "../screens/AddPostScreen";
import HomeScreen from "../screens/HomeScreen";
import colors from "../themes/colors";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
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
      <Tab.Screen component={HomeScreen} name="Home" />
      <Tab.Screen name="Add Post" component={AddPostScreen} />
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
