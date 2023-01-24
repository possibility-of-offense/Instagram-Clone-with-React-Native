import React, { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { signOut } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

// Own Dependencies
import { auth } from "../../firebase/config";
import Loader from "../../components/UI/Loader";

function LogoutScreen(props) {
  useEffect(() => {
    const unsubscribe = props.navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      e.preventDefault();
      console.log(5);

      signOut(auth)
        .then(() => {
          // props.navigation.jumpTo("Home");
          alert(`You just sign out!`);
        })
        .catch((err) => alert(`Couldn't sign out!`));
    });

    return unsubscribe;
  }, [props.navigation]);

  useFocusEffect(
    useCallback(() => {
      signOut(auth)
        .then(() => {
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
