import { useFocusEffect } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Loader from "../components/UI/Loader";
import { auth } from "../firebase/config";

function LogoutScreen({ navigation }) {
  useFocusEffect(
    useCallback(() => {
      signOut(auth)
        .then(() => {
          alert(`You just sign out!`);
        })
        .catch((err) => console.log(err));
    }, [])
  );

  return (
    <View style={styles.container}>
      <Loader visible={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LogoutScreen;
