import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Own Dependencies
import colors from "../../../themes/colors";
import Loader from "../../UI/Loader";

function UserProfileTab({ onPress, title, subTitle }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: colors.dark,
    fontSize: 16,
  },
  subTitle: {
    color: colors.lightGrey,
    fontSize: 14,
  },
});

export default UserProfileTab;
