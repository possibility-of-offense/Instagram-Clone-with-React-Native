import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";

function SearchScreen(props) {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetching = async () => {
      try {
        const users = await getDocs(
          query(collection(db, "users"), where("userId", "!=", user.uid))
        );
        console.log(users.docs.length);
      } catch (error) {
        console.log(error);
      }
    };

    fetching();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Search</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});

export default SearchScreen;
