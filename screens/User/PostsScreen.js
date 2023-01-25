import React, { useCallback, useContext, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
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
import { AuthContext } from "../../context/AuthContext";
import colors from "../../themes/colors";
import { db } from "../../firebase/config";
import { useFocusEffect } from "@react-navigation/native";
import Button from "../../components/UI/Button";
import LazyLoadListItems from "../../components/UI/ListItems/LazyLoadListItems";
import PostsHOC from "./PostsHOC";

const { height, width } = Dimensions.get("window");

function PostsScreen({ route }) {
  const { user } = useContext(AuthContext);

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
          const q = query(
            collection(db, "users", user.uid, "posts"),
            orderBy("timestamp"),
            limit(5)
          );
          const docs = await getDocs(q);
          const mappedDocs = docs.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }));
          const docSnap = await getDoc(
            doc(db, "posts", mappedDocs[mappedDocs.length - 1].id)
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

      setPostsState((prev) => ({ ...prev, loading: true, error: false }));
      const q = query(
        collection(db, "posts"),
        orderBy("timestamp"),
        startAfter(postsState.lastVisible),
        limit(5)
      );

      let documentSnapshots = await getDocs(q);
      if (!documentSnapshots.exists()) return;

      if (documentSnapshots.docs.length === 0) return;

      const mappedDocs = documentSnapshots.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      const docSnap = await getDoc(
        doc(db, "posts", mappedDocs[mappedDocs.length - 1].id)
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
  return (
    <PostsHOC
      error={postsState.error}
      loading={postsState.loading}
      styles={styles}
      posts={postsState.posts}
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
    marginVertical: 15,
    marginLeft: 15,
    width: "50%",
  },
  seePostBtnUnderlay: { color: colors.primaryWithoutOpacity },
  seePostBtnText: {
    color: colors.white,
  },
});

export default PostsScreen;
