import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { signOut } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

// Own Dependencies
import { auth } from "../firebase/config";
import Loader from "../components/UI/Loader";

function LogoutScreen({ navigation }) {
  useFocusEffect(
    useCallback(() => {
      signOut(auth)
        .then(() => {
          navigation.popToTop();

          alert(`You just sign out!`);
        })
        .catch((err) => alert(`Couldn't sign out!`));
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
