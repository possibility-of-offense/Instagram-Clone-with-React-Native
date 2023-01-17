import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

// Own Dependencies
import colors from "../../../themes/colors";

function ProfileHeader(props) {
  return (
    <View style={styles.container}>
      <AntDesign
        name="leftcircle"
        size={34}
        color={colors.primary}
        onPress={() => props.navigation.goBack()}
      />
      <Text style={styles.text}>{props.route.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    height: 100,
    paddingLeft: 15,
    paddingTop: 40,
  },
  text: {
    fontSize: 19,
    fontWeight: "bold",
    marginLeft: 20,
  },
});

export default ProfileHeader;
