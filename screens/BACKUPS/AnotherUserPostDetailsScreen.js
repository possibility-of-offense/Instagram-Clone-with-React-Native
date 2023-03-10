import React, { useCallback, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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
import Loader from "../../components/UI/Loader";
import pluralizeWord from "../../helpers/pluralizeWord";

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
    post: null,
    userObj: {},
  });

  useFocusEffect(
    useCallback(() => {
      setAnotherUserState((prev) => ({ ...prev, error: false }));

      setError(false);
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
          setAnotherUserState((prev) => ({ ...prev, error: false }));

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

          setPostObj({
            post: post.data(),
            hasLiked: likes.docs.length > 0 ? true : false,
          });
          setUserObj(user.data());
        } catch (error) {
          setError(`Couldn't get the post details!`);
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

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  } else {
    if (
      Object.values(postObj).length > 0 &&
      postObj.post !== null &&
      postObj.hasLiked !== null
    ) {
      return (
        <ScrollView style={styles.container}>
          {error && <Text style={styles.error}>{error}</Text>}
          <Image source={{ uri: postObj.post.image }} style={styles.image} />
          <View style={styles.actions}>
            <View style={styles.likesContainer}>
              {!postObj.hasLiked ? (
                <TouchableOpacity
                  onPress={handleLike}
                  style={styles.actionsIcon}
                >
                  <MaterialCommunityIcons
                    name="cards-heart-outline"
                    size={34}
                    color="black"
                  />
                </TouchableOpacity>
              ) : (
                <View style={styles.actionsIcon}>
                  <MaterialCommunityIcons
                    name="cards-heart"
                    size={34}
                    color="red"
                  />
                </View>
              )}
              <Text>{pluralizeWord("Like", postObj.post.likes)}</Text>
            </View>

            <TouchableHighlight
              onPress={() =>
                navigation.navigate("Search", {
                  screen: "Another User Comments",
                  params: {
                    userId: anotherUser,
                    postId: route.params.id,
                  },
                })
              }
              style={styles.actionsIcon}
              underlayColor="#ddd"
            >
              <View style={styles.commentsContainer}>
                <MaterialCommunityIcons
                  name="comment-outline"
                  size={34}
                  color="black"
                />
                <Text style={styles.commentsContainerText}>
                  {pluralizeWord("Comment", postObj.post.comments)}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
          <Text style={styles.description}>{postObj.post.description}</Text>
        </ScrollView>
      );
    } else {
      return <Loader visible={true} />;
    }
  }
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
