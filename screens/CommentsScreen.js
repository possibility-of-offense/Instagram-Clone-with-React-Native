import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AppInput from "../components/UI/Input";
import Loader from "../components/UI/Loader";

// Own Dependencies
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";
import colors from "../themes/colors";

function CommentsScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error !== "") setError("");
  }, [comment]);

  // Add comment
  const handleAddComment = async () => {
    if (comment === "") return setError("Fill the input");

    setLoading(true);

    try {
      await addDoc(collection(db, "comments"), {
        userId: user.uid,
        username: user.email || user.displayName,
        image: user.photoUrl || null,
        postId: route.params.postId,
        timeStamp: serverTimestamp(),
        likes: 0,
        commentBody: comment,
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const [comments, setComments] = useState([]);
  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, "comments"),
        where("postId", "==", route.params.postId)
      ),
      (snapshot) =>
        setComments(
          snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }))
        )
    );

    return () => unsub();
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.commentForm}>
        {user.photoUrl ? (
          <Image
            source={{
              uri: user.photoUrl,
            }}
            style={styles.userPhoto}
          />
        ) : (
          <Image
            source={require("../assets/images/person.jpg")}
            style={styles.userPhoto}
          />
        )}
        <View style={styles.inputContainer}>
          <AppInput
            multiline={true}
            onChange={setComment}
            placeholder="Add a comment..."
            styleObj={styles.input}
            value={comment}
          />
          <Text onPress={handleAddComment} style={styles.addBtn}>
            Post
          </Text>
        </View>
        {error && <Text style={styles.errorMsg}>{error}</Text>}
      </View>
      <View style={styles.commentsGrid}>
        {loading ? (
          <Loader visible={true} />
        ) : (
          <View>
            {comments.length > 0 &&
              comments.map((comment) => (
                <Text key={comment.id}>
                  {comment.commentBody} by {comment.username}
                </Text>
              ))}
          </View>
        )}
      </View>
    </ScrollView>
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
  userPhoto: {
    height: 40,
    width: 40,
    borderRadius: 20,
  },
});

export default CommentsScreen;
