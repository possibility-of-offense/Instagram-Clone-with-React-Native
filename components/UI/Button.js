import React from "react";
import { Text, View, StyleSheet, TouchableHighlight } from "react-native";

function Button({ disabled, styleObject, title, onPress, underlayColor }) {
  return (
    <View style={[styles.container, styleObject?.btn]}>
      <TouchableHighlight
        disabled={disabled}
        onPress={onPress}
        underlayColor={underlayColor}
      >
        <Text style={[styles.text, styleObject?.btnText]}>{title}</Text>
      </TouchableHighlight>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: "hidden",
  },
  text: {
    padding: 7,
    textAlign: "center",
  },
});

export default Button;
