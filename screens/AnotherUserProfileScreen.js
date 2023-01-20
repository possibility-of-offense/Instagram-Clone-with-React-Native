import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import React, { useCallback, useContext, useState } from "react";
import { Button, ScrollView, StyleSheet, Text, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Own Dependencies
import { AuthContext } from "../context/AuthContext";
import colors from "../themes/colors";
import { db } from "../firebase/config";

function AnotherUserProfileScreen({ navigation, route }) {
  const { id } = route.params;
  const { user } = useContext(AuthContext);

  const [userToFollow, setUserToFollow] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const userDoc = await getDoc(doc(db, "users", id));
          if (userDoc.exists())
            setUserToFollow({ id: userDoc.id, ...userDoc.data() });

          setLoading(false);
        } catch (error) {
          setLoading(false);
          setError("Error getting user info!");
        }
      };

      fetchUser();

      return () => setUserToFollow(null);
    }, [route])
  );

  const handleFollow = async () => {
    try {
      await runTransaction(db, async (transcation) => {
        const checkIfAlreadyFollowed = await getDocs(
          query(collection(db, "following"), where("userId", "==", user.uid))
        );

        if (checkIfAlreadyFollowed.docs.length > 0) return;

        await addDoc(collection(db, "following"), {
          userId: user.uid,
          username: user.email || user.displayName,
          image: user.photoURL,
          userToFollow: {
            userId: userToFollow.id,
            username: userToFollow.username || null,
            email: userToFollow.email,
            image: userToFollow.image | null,
          },
        });

        transcation.update(doc(db, "users", user.uid), {
          following: increment(1),
        });

        Alert.alert(
          "User Added",
          `${userToFollow.username || userToFollow.email} was added!`,
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Search"),
            },
          ]
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text>Another user</Text>
      <Text>Follow this user</Text>
      <Button title="Follow this user" onPress={handleFollow} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 15,
  },
});

export default AnotherUserProfileScreen;
