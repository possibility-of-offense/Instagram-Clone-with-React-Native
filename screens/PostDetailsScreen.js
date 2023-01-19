import React, { useContext, useEffect, useState } from "react";
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

// Own Dependencies
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";
import Loader from "../components/UI/Loader";
import pluralizeWord from "../helpers/pluralizeWord";

function PostDetailsScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const [postObj, setPostObj] = useState({
    post: null,
    hasLiked: null,
  });

  useEffect(() => {
    const fetching = async () => {
      try {
        const l = await getDocs(
          query(
            collection(db, "likes"),
            where("userId", "==", user.uid),
            where("postId", "==", route.params.id)
          )
        );

        const [post, likes] = await Promise.all([
          getDoc(doc(db, "users", user.uid, "posts", route.params.id)),
          getDocs(
            query(
              collection(db, "likes"),
              where("userId", "==", user.uid),
              where("postId", "==", route.params.id)
            )
          ),
        ]);

        setPostObj({
          post: post.data(),
          hasLiked: likes.docs.length > 0 ? true : false,
        });
      } catch (error) {}
    };

    fetching();
  }, []);

  const handleLike = async () => {
    try {
      setPostObj({
        post: {
          ...postObj.post,
          likes: postObj.post.likes + 1,
        },
        hasLiked: true,
      });

      await updateDoc(doc(db, "users", user.uid, "posts", route.params.id), {
        likes: increment(1),
      });
      await addDoc(collection(db, "likes"), {
        userId: user.uid,
        username: user.email || user.displayName,
        image: user.photoUrl || null,
        postId: route.params.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (
    Object.values(postObj).length > 0 &&
    postObj.post !== null &&
    postObj.hasLiked !== null
  ) {
    return (
      <ScrollView style={styles.container}>
        <Image source={{ uri: postObj.post.image }} style={styles.image} />
        <View style={styles.actions}>
          <View style={styles.likesContainer}>
            {!postObj.hasLiked ? (
              <TouchableOpacity onPress={handleLike} style={styles.actionsIcon}>
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
              navigation.navigate("Comments", { postId: route.params.id })
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

export default PostDetailsScreen;
