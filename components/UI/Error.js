import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

function Error({ error, styleObj = {} }) {
  const [msg, setMsg] = useState("");

  useEffect(() => {
    switch (error) {
      case "auth/too-many-requests":
        setMsg("Too many requests! Try again later!");
        break;
      case "auth/invalid-email":
        setMsg("Invalid email!");
        break;
      case "auth/user-not-found":
        setMsg("User with that email was not found!");
        break;
      case "auth/wrong-password":
        setMsg("Wrong password!");
        break;
      default:
        setMsg(error);
    }
  }, []);

  return (
    <View>
      <Text style={[styles.text, styleObj]}>{msg}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "red",
  },
});

export default Error;
