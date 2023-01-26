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
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

// Own Dependencies
import AppInput from "../../components/UI/Input";
import { db } from "../../firebase/config";
import colors from "../../themes/colors";
import formatDate from "../../helpers/formatDate";
import Loader from "../../components/UI/Loader";
import { useFocusEffect } from "@react-navigation/native";

function AnotherUserCommentsScreen({ navigation, route }) {
  const [user, setUser] = useState({});
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (error !== "") setError(false);
  }, [comment]);

  useFocusEffect(
    useCallback(() => {
      setError(false);
      setLoading(false);

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
          setComments(
            snapshot.docs.map((document) => ({
              id: document.id,
              ...document.data(),
            }))
          );
        }
      );

      const fetchUser = async () => {
        try {
          const userObj = await getDoc(doc(db, "users", route.params.userId));
          setUser(
            userObj.exists() ? { id: userObj.id, ...userObj.data() } : {}
          );
        } catch (error) {
          setError(`Could't get the user! Try again!`);
        }
      };

      fetchUser();
      return () => unsub();
    }, [route])
  );

  // Add comment
  const handleAddComment = async () => {
    if (comment === "") return setError("Fill the input");

    setLoading(true);
    setComment("");

    try {
      await addDoc(collection(db, "comments"), {
        userId: user.id,
        username: user.email || user.displayName,
        image: user.photoURL || null,
        postId: route.params.postId,
        timestamp: serverTimestamp(),
        likes: 0,
        commentBody: comment,
      });

      await updateDoc(doc(db, "users", user.id, "posts", route.params.postId), {
        comments: increment(1),
      });

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.commentForm}>
        {user.photoURL ? (
          <Image
            source={{
              uri: user.photoURL,
            }}
            style={styles.userPhoto}
          />
        ) : (
          <Image
            source={require("../../assets/images/person.jpg")}
            style={styles.userPhoto}
          />
        )}
        <View style={styles.inputContainer}>
          <AppInput
            autoComplete="off"
            autoCorrect={false}
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
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <View key={item.id} style={styles.listItem}>
                  <View style={styles.listItemBody}>
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                      />
                    ) : (
                      <Image
                        style={styles.image}
                        source={require("../../assets/images/person.jpg")}
                      />
                    )}
                    <View style={styles.commentBody}>
                      <Text style={styles.commentBodyText}>
                        <Text style={styles.commentBodyUsername}>
                          {item.username}
                        </Text>{" "}
                        {item.commentBody}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
                </View>
              );
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{ borderBottomWidth: 1, borderBottomColor: "#ddd" }}
              />
            )}
            onEndReachedThreshold={0}
          />
        )}
      </View>
    </View>
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
