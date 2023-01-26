import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { signOut } from "firebase/auth";

import { TabActions } from "@react-navigation/native";

// Own Dependencies
import { auth } from "../../firebase/config";
import Loader from "../../components/UI/Loader";

function LogoutScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", (e) => {
      // Prevent default behavior
      e.preventDefault();

      TabActions.replace("Logout", "Home");

      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: getLogoutRoute,
      //     routes: [{ name: "Home" }],
      //   })
      // );
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      setLoading(false);

      await signOut(auth);

      alert(`You just sign out`);
    } catch (error) {
      setLoading(false);
      alert(`Couldn't logout!`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Are you sure you want to sign out?</Text>
      <View style={styles.btnContainer}>
        <Button onPress={handleLogout} title="Logout" />
      </View>
      {loading && <Loader visible={true} />}
    </View>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    alignSelf: "center",
    width: "60%",
  },
  container: {
    flex: 1,
  },
  text: {
    fontSize: 17,
    marginVertical: 10,
    padding: 10,
    textAlign: "center",
  },
});

export default LogoutScreen;
