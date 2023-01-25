import React, { useCallback, useContext, useState } from "react";
import { Image, View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";

// Own Dependencies

import { AuthContext } from "../../context/AuthContext";
import AppInput from "../../components/UI/Input";
import Button from "../../components/UI/Button";
import colors from "../../themes/colors";
import Error from "../../components/UI/Error";
import handleAddPost from "./helpers/addPost";
import Loader from "../../components/UI/Loader";
import useImagePick from "../../hooks/useImagePick";
import UserImage from "../../components/UI/UserImage";

function AddPostScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState({
    description: "",
    focusInp: false,
    error: false,
    image: null,
    loading: false,
  });

  // Custom Hook
  const { pickImage } = useImagePick({
    setImage: (image) => setPost((prev) => ({ ...prev, image })),
  });

  // Clear Data when navigate here
  const isFocused = useIsFocused();
  useFocusEffect(
    useCallback(() => {
      setPost({
        description: "",
        focusInp: true,
        error: false,
        image: null,
        loading: false,
      });
    }, [route.params, isFocused])
  );

  return (
    <View style={styles.container}>
      {!post.loading && (
        <>
          <View style={styles.addPostContainer}>
            <UserImage image={user.photoURL} styles={styles.personImage} />

            <View style={styles.textInputContainer}>
              <AppInput
                multiline={true}
                onChange={(description) =>
                  setPost((prev) => ({ ...prev, description }))
                }
                styleObj={styles.textInput}
                toFocus={post.focusInp}
                placeholder="Enter description"
                value={post.description}
              />

              {post.image ? (
                <View style={styles.imageContainer}>
                  <Image style={styles.image} source={{ uri: post.image }} />
                  <TouchableOpacity
                    onPress={() =>
                      setPost((prev) => ({ ...prev, image: null }))
                    }
                  >
                    <FontAwesome name="remove" size={24} color={colors.dark} />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity onPress={pickImage}>
                  <MaterialIcons
                    name="add-a-photo"
                    size={32}
                    color={colors.dark}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Button
            disabled={post.loading}
            onPress={handleAddPost.bind(null, {
              navigation,
              post,
              setPost,
              user,
            })}
            title="Post"
            styleObject={{ btn: styles.btn, btnText: styles.btnText }}
            underlayColor={colors.primaryWithoutOpacity}
          />
        </>
      )}
      {post.loading && <Loader visible={post.loading} />}
      {!post.loading && post.error && (
        <View style={styles.errorContainer}>
          <Error error={post.error} styleObj={styles.errorText} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addPostContainer: {
    backgroundColor: colors.white,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    padding: 10,
  },
  btn: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    marginTop: 10,
    width: "50%",
  },
  btnText: { color: colors.white },
  container: {
    flex: 1,
  },
  errorContainer: {
    paddingVertical: 10,
    textAlign: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  image: { width: 60, height: 60, marginRight: 6 },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  personImage: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  textInput: {
    borderWidth: 0,
    flex: 1,
    marginBottom: 0,
    marginHorizontal: 7,
    paddingVertical: 6,
  },
});

export default AddPostScreen;
