import React from "react";

import { Image, StyleSheet, View } from "react-native";

function UserImage({ image, styles }) {
  return image ? (
    <Image source={{ uri: image }} style={styles} />
  ) : (
    <Image source={require("../../assets/images/person.jpg")} style={styles} />
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default UserImage;
