import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

import { Dimensions } from "react-native";

// Own Dependecies
import colors from "../themes/colors";

const { height, width } = Dimensions.get("window");

function HomeScreen(props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Home</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: height,
    width: width,
  },
  text: {
    fontSize: 20,
    padding: 10,
    textAlign: "center",
  },
});

export default HomeScreen;
