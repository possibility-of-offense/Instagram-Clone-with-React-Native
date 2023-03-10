import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import {
  collection,
  query,
  getDocs,
  orderBy,
  startAfter,
  limit,
  getDoc,
  doc,
} from "firebase/firestore";
import { Dimensions } from "react-native";

// Own Dependecies
import colors from "../../themes/colors";
import { db } from "../../firebase/config";
import { useFocusEffect } from "@react-navigation/native";
import PostsHOC from "../User/PostsHOC";
import GoBack from "./GoBack";

const { height, width } = Dimensions.get("window");

function AnotherUserPostsScreen({ navigation, route }) {
  let anotherUser = route.params.id;

  const [postsState, setPostsState] = useState({
    error: false,
    lastVisible: null,
    loading: false,
    posts: [],
  });

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({ title: "Back to Profile Page" });

      const fetching = async () => {
        setPostsState((prev) => ({ ...prev, error: false }));

        try {
          setPostsState((prev) => ({ ...prev, loading: true }));

          const q = query(
            collection(db, "users", anotherUser, "posts"),
            orderBy("timestamp"),
            limit(5)
          );
          const docs = await getDocs(q);
          const mappedDocs = docs.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }));

          const docSnap = await getDoc(
            doc(
              db,
              "users",
              anotherUser,
              "posts",
              mappedDocs[mappedDocs.length - 1].id
            )
          );

          setPostsState((prev) => ({
            ...prev,
            lastVisible: docSnap,
            loading: false,
            posts: mappedDocs,
          }));
        } catch (error) {
          setPostsState((prev) => ({
            ...prev,
            error: `Couldn't get the posts! It is possible that the user has no posts yet!`,
            loading: false,
          }));
        }
      };
      fetching();
    }, [route])
  );

  const retrieveMore = async () => {
    try {
      if (!postsState.lastVisible || !postsState.lastVisible.exists())
        return null;

      const q = query(
        collection(db, "users", anotherUser, "posts"),
        orderBy("timestamp"),
        startAfter(postsState.lastVisible),
        limit(5)
      );

      let documentSnapshots = await getDocs(q);

      if (documentSnapshots.docs.length === 0) return;
      setPostsState((prev) => ({ ...prev, loading: true, error: false }));

      const mappedDocs = documentSnapshots.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      const docSnap = await getDoc(
        doc(
          db,
          "users",
          anotherUser,
          "posts",
          mappedDocs[mappedDocs.length - 1].id
        )
      );

      setPostsState((prev) => ({
        ...prev,
        loading: false,
        lastVisible: docSnap,
        posts: postsState.posts.concat(mappedDocs),
      }));
    } catch (error) {
      setPostsState((prev) => ({
        ...prev,
        error: `Couldn't get the posts`,
        loading: false,
      }));
    }
  };

  return (
    <>
      <GoBack
        onPress={() => {
          navigation.navigate("Search", {
            screen: "Another User",
            params: {
              id: route?.params?.id,
            },
          });
        }}
      >
        Go back to Profile Page
      </GoBack>
      <PostsHOC
        anotherUser={true}
        error={postsState.error}
        loading={postsState.loading}
        posts={postsState.posts}
        styles={styles}
        retrieveMore={retrieveMore}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: height,
    paddingBottom: 90,
    width: width,
  },
  description: {
    fontSize: 17,
    padding: 20,
  },
  error: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  listItem: {
    alignItems: "center",
    justifyContent: "center",
    width: width,
  },
  image: {
    width: "100%",
    height: 500,
  },
  seePostBtn: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    marginVertical: 35,
    marginLeft: 15,
    width: "50%",
  },
  seePostBtnUnderlay: { color: colors.primaryWithoutOpacity },
  seePostBtnText: {
    color: colors.white,
  },
});

export default AnotherUserPostsScreen;
