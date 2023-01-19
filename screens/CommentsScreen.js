import React, { useContext, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import AppInput from "../components/UI/Input";

// Own Dependencies
import { AuthContext } from "../context/AuthContext";
import colors from "../themes/colors";

function CommentsScreen(props) {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");

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
          <Text onPress={() => console.log("press")} style={styles.addBtn}>
            Post
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    color: colors.primary,
    position: "absolute",
    right: 18,
    bottom: 10,
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
    padding: 14,
    paddingHorizontal: 20,
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
