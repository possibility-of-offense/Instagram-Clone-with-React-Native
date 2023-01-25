import React, { useCallback, useContext, useState } from "react";
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
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import Loader from "../../components/UI/Loader";
import pluralizeWord from "../../helpers/pluralizeWord";
import { useFocusEffect } from "@react-navigation/native";
import PostDetailsHOC from "./PostDetailsHOC";

function PostDetailsScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);
  const [postState, setPostState] = useState({
    error: false,
    post: {},
    hasLiked: null,
  });

  useFocusEffect(
    useCallback(() => {
      setPostState((prev) => ({ ...prev, error: false }));
      const fetching = async () => {
        try {
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

          setPostState({
            post: post.data(),
            hasLiked: likes.docs.length > 0 ? true : false,
          });
        } catch (error) {
          setPostState((prev) => ({
            ...prev,
            error: `Couldn't get post details!`,
          }));
        }
      };

      fetching();
    }, [route])
  );

  const handleLike = async () => {
    try {
      setPostState({
        post: {
          ...postState.post,
          likes: postState.post.likes + 1,
        },
        hasLiked: true,
      });

      await updateDoc(doc(db, "users", user.uid, "posts", route.params.id), {
        likes: increment(1),
      });
      await addDoc(collection(db, "likes"), {
        userId: user.uid,
        username: user.displayName || user.email,
        image: user.photoURL || null,
        postId: route.params.id,
      });
    } catch (error) {
      setPostState((prev) => ({
        ...prev,
        error: `Couldn't like the post! Try again!`,
      }));
    }
  };

  return (
    <PostDetailsHOC
      error={postState.error}
      handleLike={handleLike}
      hasLiked={postState.hasLiked}
      postObj={postState.post}
      styles={styles}
    />
  );

  // if (postState.error) {
  //   return <Text style={styles.error}>{postState.error}</Text>;
  // } else {
  // if (
  //   Object.values(postObj).length > 0 &&
  //   postObj.post !== null &&
  //   postObj.hasLiked !== null
  // ) {
  //   return (
  //     <ScrollView style={styles.container}>
  //       {error && <Text style={styles.error}>{error}</Text>}
  //       <Image
  //         source={{ uri: postObj?.post?.postImage }}
  //         style={styles.image}
  //       />
  //       <View style={styles.actions}>
  //         <View style={styles.likesContainer}>
  //           {!postObj.hasLiked ? (
  //             <TouchableOpacity
  //               onPress={handleLike}
  //               style={styles.actionsIcon}
  //             >
  //               <MaterialCommunityIcons
  //                 name="cards-heart-outline"
  //                 size={34}
  //                 color="black"
  //               />
  //             </TouchableOpacity>
  //           ) : (
  //             <View style={styles.actionsIcon}>
  //               <MaterialCommunityIcons
  //                 name="cards-heart"
  //                 size={34}
  //                 color="red"
  //               />
  //             </View>
  //           )}
  //           <Text>{pluralizeWord("Like", postObj?.post?.likes)}</Text>
  //         </View>
  //         <TouchableHighlight
  //           onPress={() =>
  //             navigation.navigate("Comments", { postId: route.params.id })
  //           }
  //           style={styles.actionsIcon}
  //           underlayColor="#ddd"
  //         >
  //           <View style={styles.commentsContainer}>
  //             <MaterialCommunityIcons
  //               name="comment-outline"
  //               size={34}
  //               color="black"
  //             />
  //             <Text style={styles.commentsContainerText}>
  //               {pluralizeWord("Comment", postObj?.post?.comments)}
  //             </Text>
  //           </View>
  //         </TouchableHighlight>
  //       </View>
  //       <Text style={styles.description}>{postObj?.post?.description}</Text>
  //     </ScrollView>
  //   );
  // } else {
  //   return <Loader visible={true} />;
  // }
  // }
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

export default PostDetailsScreen;
