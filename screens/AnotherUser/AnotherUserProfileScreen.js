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
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Own Dependencies
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import UserProfileHOC from "../User/UserProfileHOC";

function AnotherUserProfileScreen({ navigation, route }) {
  const { id } = route.params;
  const { user } = useContext(AuthContext);

  const [anotherUserState, setAnotherUserState] = useState({
    alreadyFollowed: false,
    error: false,
    loading: false,
    postsOfUser: [],
    followerOfUser: {},
  });

  useFocusEffect(
    useCallback(() => {
      setAnotherUserState((prev) => ({
        ...prev,
        error: false,
        loading: false,
      }));

      const fetchUser = async () => {
        setAnotherUserState((prev) => ({ ...prev, loading: true }));

        try {
          const checkIfAlreadyFollowed = await getDocs(
            query(collection(db, "following"), where("userId", "==", user.uid))
          );

          if (checkIfAlreadyFollowed.docs.length > 0)
            setAnotherUserState((prev) => ({ ...prev, alreadyFollowed: true }));

          const userDoc = await getDoc(doc(db, "users", id));
          if (userDoc.exists())
            setAnotherUserState((prev) => ({
              ...prev,
              followerOfUser: { id: userDoc.id, ...userDoc.data() },
            }));

          const postsQuery = await getDocs(
            query(
              collection(db, "users", userDoc.id, "posts"),
              where("userId", "==", userDoc.id)
            )
          );
          if (postsQuery.docs.length > 0) {
            setAnotherUserState((prev) => ({
              ...prev,
              postsOfUser: postsQuery.docs.map((document) => ({
                id: document.id,
                ...document.data(),
              })),
            }));
          }

          setAnotherUserState((prev) => ({ ...prev, loading: false }));
        } catch (error) {
          setAnotherUserState((prev) => ({
            ...prev,
            loading: false,
            error: `Error getting user info!`,
          }));
        }
      };

      fetchUser();

      return () =>
        setAnotherUserState((prev) => ({ ...prev, followerOfUser: null }));
    }, [route])
  );

  const handleFollow = async () => {
    try {
      await runTransaction(db, async (transcation) => {
        await addDoc(collection(db, "following"), {
          userId: user.uid,
          username: user.email || user.displayName,
          image: user.photoURL,
          followerOfUser: anotherUserState.followerOfUser,
        });
        await addDoc(collection(db, "followers"), {
          userId: anotherUserState.followerOfUser.id,
          username: anotherUserState.followerOfUser.username || null,
          email: anotherUserState.followerOfUser.email,
          image: anotherUserState.followerOfUser.image || null,
          followedByUser: {
            userId: user.uid,
            username: user?.displayName || user?.email,
            image: user.photoURL,
          },
        });

        transcation.update(doc(db, "users", user.uid), {
          following: increment(1),
        });
        transcation.update(
          doc(db, "users", anotherUserState.followerOfUser.id),
          {
            followers: increment(1),
          }
        );
        setAnotherUserState((prev) => ({
          ...prev,
          alreadyFollowed: true,
          followerOfUser: {
            ...prev.followerOfUser,
            followers: prev.followerOfUser.followers + 1,
          },
        }));

        Alert.alert(
          "User Added",
          `${
            anotherUserState.followerOfUser.username ||
            anotherUserState.followerOfUser.email
          } have been followed!`,
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Search"),
            },
          ]
        );
      });
    } catch (error) {
      setAnotherUserState((prev) => ({
        ...prev,
        error: `Couldn't follow the user! Try again!`,
      }));
    }
  };

  return (
    <UserProfileHOC
      anotherUserRoutes={true}
      alreadyFollowed={anotherUserState.alreadyFollowed}
      error={anotherUserState.error}
      image={anotherUserState.image}
      loading={anotherUserState.loading}
      handleFollow={handleFollow}
      postsData={anotherUserState.postsOfUser}
      showEdit={false}
      user={anotherUserState.followerOfUser}
      userData={anotherUserState.followerOfUser}
      id={id}
    />
  );
}

export default AnotherUserProfileScreen;
