import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { signOut } from "firebase/auth";

// Own Dependencies
import { auth } from "../../firebase/config";
import Loader from "../../components/UI/Loader";
import { useAuth } from "../../hooks/useAuth";

function LogoutScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const { setAuthStateFetching } = useAuth();

  const handleLogout = async () => {
    setLoading(true);
    try {
      setLoading(false);

      setAuthStateFetching(false);
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
