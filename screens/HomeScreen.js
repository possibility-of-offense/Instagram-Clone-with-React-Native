import { useFocusEffect } from "@react-navigation/native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useCallback, useContext, useEffect } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

import { Dimensions } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";

// Own Dependecies
import colors from "../themes/colors";

const { height, width } = Dimensions.get("window");

function HomeScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  let anotherUser;

  if (route.params) {
    if (user.uid !== route.params?.id) {
      anotherUser = route.params.id;
    } else {
      anotherUser = user.uid;
    }
  } else {
    anotherUser = user.uid;
  }

  useFocusEffect(
    useCallback(() => {
      onSnapshot(
        query(collection(db, "following"), where("userId", "==", user.uid)),
        (snapshot) => {
          snapshot.docs.forEach((d) => {
            console.log(d.data());
          });
        }
      );
    }, [route])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Home</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: height,
    width: width,
  },
  text: {
    fontSize: 20,
    padding: 10,
    textAlign: "center",
  },
});

export default HomeScreen;
