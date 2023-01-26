import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

// Own Dependencies
import colors from "../../themes/colors";

function GoBack({ children, onPress }) {
  return (
    <View style={styles.container}>
      <Ionicons name="chevron-back" size={24} color={colors.primary} />
      <Text onPress={onPress} style={styles.text}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.white,
    flexDirection: "row",
    paddingVertical: 10,
    paddingLeft: 10,
  },
  text: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "bold",
    marginLeft: 7,
  },
});

export default GoBack;
