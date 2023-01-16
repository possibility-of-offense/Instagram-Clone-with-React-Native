import React from "react";
import { View, StyleSheet, Text } from "react-native";
import colors from "../themes/colors";

function HomeScreen(props) {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 15,
  },
});

export default HomeScreen;
