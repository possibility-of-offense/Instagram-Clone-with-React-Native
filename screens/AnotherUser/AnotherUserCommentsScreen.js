import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Own Dependencies
import { db } from "../../firebase/config";
import colors from "../../themes/colors";
import CommentsHOC from "../User/CommentsHOC";
import GoBack from "./GoBack";

function AnotherUserCommentsScreen({ navigation, route }) {
  const [user, setUser] = useState({});

  const [commentsState, setCommentsState] = useState({
    comment: "",
    comments: [],
    error: false,
    loading: false,
    user: {},
  });

  useEffect(() => {
    if (commentsState.error !== "")
      setCommentsState((prev) => ({ ...prev, error: false }));
  }, [commentsState.comment]);

  useFocusEffect(
    useCallback(() => {
      setCommentsState((prev) => ({ ...prev, error: false, loading: false }));

      navigation.setOptions({
        title: "Back to Post",
      });

      const unsub = onSnapshot(
        query(
          collection(db, "comments"),
          where("postId", "==", route.params.postId),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          setCommentsState((prev) => ({
            ...prev,
            comments: snapshot.docs.map((document) => ({
              id: document.id,
              ...document.data(),
            })),
          }));
        }
      );

      const fetchUser = async () => {
        try {
          const userObj = await getDoc(doc(db, "users", route.params.userId));
          setUser(
            userObj.exists() ? { id: userObj.id, ...userObj.data() } : {}
          );
        } catch (error) {
          setCommentsState((prev) => ({
            ...prev,
            error: `Could't get the user! Try again!`,
          }));
        }
      };

      fetchUser();
      return () => unsub();
    }, [route])
  );

  // Add comment
  const handleAddComment = async () => {
    if (commentsState.comment === "")
      return setCommentsState((prev) => ({ ...prev, error: `Fill the input` }));

    setCommentsState((prev) => ({ ...prev, comment: "", loading: true }));

    try {
      await addDoc(collection(db, "comments"), {
        userId: user.id,
        username: user.email || user.displayName,
        image: user.photoURL || null,
        postId: route.params.postId,
        timestamp: serverTimestamp(),
        likes: 0,
        commentBody: commentsState.comment,
      });

      await updateDoc(doc(db, "users", user.id, "posts", route.params.postId), {
        comments: increment(1),
      });

      setCommentsState((prev) => ({ ...prev, loading: false }));
    } catch (error) {
      setCommentsState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <>
      <GoBack
        onPress={() =>
          navigation.navigate("Search", {
            screen: "Another Post Details",
            params: {
              userId: route?.params?.userId,
              id: route?.params?.postId,
            },
          })
        }
      >
        Back to the Post
      </GoBack>
      <CommentsHOC
        comment={commentsState.comment}
        comments={commentsState.comments}
        error={commentsState.error}
        handleAddComment={handleAddComment}
        loading={commentsState.loading}
        setComment={(comment) =>
          setCommentsState((prev) => ({ ...prev, comment }))
        }
        styles={styles}
        user={user}
      />
    </>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    color: colors.primary,
    position: "absolute",
    right: 18,
    bottom: 0,
    padding: 10,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
  },
  commentBody: {
    paddingLeft: 20,
    paddingTop: 7,
  },
  commentBodyText: {
    fontSize: 16,
    lineHeight: 20,
  },
  commentBodyUsername: {
    fontWeight: "bold",
  },
  commentForm: {
    backgroundColor: "#efefef",
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 14,
    paddingHorizontal: 20,
  },
  commentsGrid: {
    minHeight: Dimensions.get("window").height / 2,
  },
  date: {
    textAlign: "right",
    paddingTop: 5,
  },
  errorMsg: {
    color: "red",
    flexBasis: "100%",
    fontSize: 18,
    paddingTop: 10,
    textAlign: "center",
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderRadius: 30,
    borderColor: colors.grey,
    borderWidth: 1,
    flex: 1,
    marginLeft: 15,
    overflow: "hidden",
  },
  input: {
    borderWidth: 0,
    flex: 1,
    marginBottom: 0,
    padding: 1524121142,
    paddingHorizontal: 20,
    paddingRight: 60,
  },
  image: {
    bordeRadius: 20,
    height: 40,
    width: 40,
  },
  listItem: {
    flexDirection: "column",
    padding: 10,
    paddingRight: 20,
  },
  listItemBody: {
    flexDirection: "row",
    paddingRight: 30,
  },
  userPhoto: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

export default AnotherUserCommentsScreen;
