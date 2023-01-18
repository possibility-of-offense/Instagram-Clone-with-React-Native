import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Own Dependencies
import { AuthContext } from "../context/AuthContext";
import useApi from "../api/useApi";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  increment,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

function PostDetailsScreen(props) {
  const { user } = useContext(AuthContext);

  const { data: post } = useApi({
    id: props.route.params.id,
    type: "document",
    name: "posts",
    realTime: false,
  });

  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetching = async () => {
      try {
        const findById = await getDocs(
          query(
            collection(db, "likes"),
            where("userId", "==", user.uid),
            where("postId", "==", props.route.params.id)
          )
        );

        if (findById.docs.length > 0) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      } catch (error) {}
    };

    fetching();
  }, []);

  const handleLike = async () => {
    try {
      setIsLiked(true);
      await updateDoc(doc(db, "posts", props.route.params.id), {
        likes: increment(1),
      });
      await addDoc(collection(db, "likes"), {
        userId: user.uid,
        username: user.email || user.displayName,
        image: user.photoUrl || null,
        postId: props.route.params.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (post) {
    return (
      <ScrollView style={styles.container}>
        <Image source={{ uri: post.image }} style={styles.image} />
        <View style={styles.actions}>
          {!isLiked ? (
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
          <TouchableOpacity style={styles.actionsIcon}>
            <MaterialCommunityIcons
              name="comment-outline"
              size={34}
              color="black"
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>{post.description}</Text>
      </ScrollView>
    );
  } else {
    return <Text>Waiting...</Text>;
  }
}

const styles = StyleSheet.create({
  actionsIcon: {
    marginRight: 10,
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 15,
    paddingTop: 10,
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
});

export default PostDetailsScreen;
