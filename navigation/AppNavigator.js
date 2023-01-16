import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Constants from "expo-constants";
import { View, StyleSheet } from "react-native";
import Logo from "../components/Logo/Logo";

// Own Dependencies
import HomeScreen from "../screens/HomeScreen";
import colors from "../themes/colors";

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        component={HomeScreen}
        name="Home"
        options={{
          header: () => (
            <View style={styles.header}>
              <Logo width="100" height="30" />
            </View>
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
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    paddingBottom: 10,
  },
});

export default AppNavigator;
