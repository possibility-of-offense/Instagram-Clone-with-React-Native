import React from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

// Own Dependencies
import Loader from "../../components/UI/Loader";
import pluralizeWord from "../../helpers/pluralizeWord";

function PostDetailsHOC({
  anotherUser = null,
  error,
  handleLike,
  hasLiked,
  postObj,
  styles,
}) {
  const navigation = useNavigation();
  const route = useRoute();

  if (
    Object.values(postObj).length > 0 &&
    postObj !== null &&
    hasLiked !== null
  ) {
    return (
      <ScrollView style={styles.container}>
        {error && <Text style={styles.error}>{error}</Text>}
        <Image source={{ uri: postObj?.postImage }} style={styles.image} />
        <View style={styles.actions}>
          <View style={styles.likesContainer}>
            {!hasLiked ? (
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
            <Text>{pluralizeWord("Like", postObj?.likes)}</Text>
          </View>

          {!anotherUser ? (
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
                  {pluralizeWord("Comment", postObj?.comments)}
                </Text>
              </View>
            </TouchableHighlight>
          ) : (
            <TouchableHighlight
              onPress={() =>
                navigation.navigate("Search", {
                  screen: "Another User Comments",
                  params: {
                    userId: route.params?.userId,
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
                  {pluralizeWord("Comment", postObj.comments)}
                </Text>
              </View>
            </TouchableHighlight>
          )}
        </View>
        <Text style={styles.description}>{postObj?.description}</Text>
      </ScrollView>
    );
  } else {
    return <Loader visible={true} />;
  }
}

export default PostDetailsHOC;
