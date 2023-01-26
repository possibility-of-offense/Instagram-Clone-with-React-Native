import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

// Own Dependencies
import { db } from "../../firebase/config";
import PostDetailsHOC from "../User/PostDetailsHOC";

function AnotherUserPostDetailsScreen({ navigation, route }) {
  let anotherUser = route.params?.userId;

  const [postObj, setPostObj] = useState({
    post: null,
    hasLiked: null,
  });
  const [userObj, setUserObj] = useState({});

  const [error, setError] = useState(false);

  const [anotherUserState, setAnotherUserState] = useState({
    error: false,
    loading: false,
    hasLiked: null,
    post: {},
    userObj: {},
  });

  useFocusEffect(
    useCallback(() => {
      setAnotherUserState((prev) => ({ ...prev, error: false }));
      const previousScreen =
        navigation.getState()?.routeNames[navigation.getState().index];

      navigation.setOptions({
        title:
          previousScreen !== "Another User Posts"
            ? "Back to Profile Page"
            : "All Posts",
      });

      const fetching = async () => {
        try {
          setAnotherUserState((prev) => ({ ...prev, loading: true }));

          const [post, likes, user] = await Promise.all([
            getDoc(doc(db, "users", anotherUser, "posts", route.params.id)),
            getDocs(
              query(
                collection(db, "likes"),
                where("userId", "==", anotherUser),
                where("postId", "==", route.params.id)
              )
            ),
            getDoc(doc(db, "users", anotherUser)),
          ]);

          setAnotherUserState((prev) => ({
            ...prev,
            hasLiked: likes.docs.length > 0 ? true : false,
            loading: true,
            userObj: user.data(),
            post: post.data(),
          }));
        } catch (error) {
          setAnotherUserState((prev) => ({
            ...prev,
            error: `Couldn't get the post details!`,
            loading: true,
          }));
        }
      };

      fetching();
    }, [route])
  );

  const handleLike = async () => {
    try {
      setPostObj({
        post: {
          ...postObj.post,
          likes: postObj.post.likes + 1,
        },
        hasLiked: true,
      });

      await updateDoc(doc(db, "users", anotherUser, "posts", route.params.id), {
        likes: increment(1),
      });
      await addDoc(collection(db, "likes"), {
        userId: anotherUser,
        username: userObj.email || userObj.displayName,
        image: userObj.photoURL || null,
        postId: route.params.id,
      });
    } catch (error) {
      setError(`Couldn't like the post! Try again!`);
    }
  };

  return (
    <PostDetailsHOC
      anotherUser={true}
      error={anotherUserState.error}
      hasLiked={anotherUserState.hasLiked}
      handleLike={() => {}}
      postObj={anotherUserState.post}
      styles={styles}
    />
  );
}

const styles = StyleSheet.create({
  actionsIcon: {
    borderRadius: 15,
    marginRight: 10,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  commentsContainer: {
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
    padding: 6,
  },
  commentsContainerText: {
    paddingLeft: 10,
  },
  container: {},
  description: {
    fontSize: 17,
    padding: 15,
    paddingLeft: 20,
  },
  error: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 500,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },
});

export default AnotherUserPostDetailsScreen;
