import { useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useCallback, useContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Dimensions } from "react-native";
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

// Own Dependencies
import { AuthContext } from "../context/AuthContext";
import colors from "../themes/colors";
import { db } from "../firebase/config";
import LazyLoadListItems from "../components/UI/ListItems/LazyLoadListItems";

const { height, width } = Dimensions.get("window");

function HomeUsersFeed({}) {
  const { user } = useContext(AuthContext);
  const route = useRoute();

  const [postsState, setPostsState] = useState({
    error: false,
    loading: false,
    lastVisible: null,
    posts: [],
    user: {},
  });

  useFocusEffect(
    useCallback(() => {
      const fetching = async () => {
        setPostsState((prev) => ({ ...prev, loading: true, error: false }));

        try {
          const currentUser = await getDoc(doc(db, "users", user.uid));

          if (!currentUser.exists()) {
            return setPostsState((prev) => ({
              ...prev,
              error: `Error ocurred!`,
            }));
          }

          const q = query(
            collection(
              db,
              "users",
              currentUser.data().homeFollowingUser,
              "posts"
            ),
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
              currentUser.data().homeFollowingUser,
              "posts",
              mappedDocs[mappedDocs.length - 1].id
            )
          );

          setPostsState((prev) => ({
            ...prev,
            loading: false,
            lastVisible: docSnap,
            posts: mappedDocs,
          }));
        } catch (error) {
          setPostsState((prev) => ({
            ...prev,
            error: `Couldn't get the posts`,
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

      const currentUser = await getDoc(doc(db, "users", user.uid));
      const q = query(
        collection(db, "users", currentUser.data().homeFollowingUser, "posts"),
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
          currentUser.data().homeFollowingUser,
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
    <LazyLoadListItems
      anotherUser={true}
      data={postsState.posts}
      error={postsState.error}
      loading={postsState.loading}
      styles={styles}
      retrieveMore={retrieveMore}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: height,
    paddingBottom: 90,
    width: width,
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

export default HomeUsersFeed;
