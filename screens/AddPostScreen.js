import React, { useContext, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import * as ImagePicker from "expo-image-picker";
import { useIsFocused } from "@react-navigation/native";

// Own Dependencies

import { AuthContext } from "../context/AuthContext";
import AppInput from "../components/UI/Input";
import Button from "../components/UI/Button";
import Error from "../components/UI/Error";
import Loader from "../components/UI/Loader";
import colors from "../themes/colors";
import { db, storage } from "../firebase/config";

function AddPostScreen(props) {
  const isFocused = useIsFocused();

  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { user } = useContext(AuthContext);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // // Handle publish post
  const handlePost = async () => {
    const id = await nanoid();

    if (!image || description === "") {
      setError("Fill the inputs first!");
      return;
    }

    setLoading(true);

    try {
      let userPostImageRef;

      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function () {
          reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image, true);
        xhr.send(null);
      });
      userPostImageRef = ref(storage, `users/${user.uid}/${id}/postImage`);
      uploadBytes(userPostImageRef, blob).then((snapshot) => {
        getDownloadURL(userPostImageRef)
          .then((url) => {
            return addDoc(collection(db, "users", user.uid, "posts"), {
              userId: user.uid,
              description,
              image: url,
              timestamp: serverTimestamp(),
              likes: 0,
              comments: 0,
              popular: false,
            })
              .then((data) => {
                updateDoc(doc(db, "users", user.uid), {
                  posts: increment(1),
                })
                  .then(() => {
                    setDescription(null);
                    setImage(null);
                    setLoading(false);
                    props.navigation.navigate("Profile", {
                      screen: "All Posts",
                      postAdded: true,
                    });
                  })
                  .catch((err) => setError(`Couldn't add document!`));
              })
              .catch((err) => setError(`Couldn't add document!`));
          })
          .catch((err) => setError(`Couldn't upload image!`));
      });
    } catch (error) {
      setError(`Couldn't upload image!`);
    }
  };

  return (
    <View style={styles.container}>
      {!loading && (
        <>
          <View style={styles.addPostContainer}>
            <Image
              source={require("../assets/images/person.jpg")}
              style={styles.personImage}
            />
            <View style={styles.textInputContainer}>
              <AppInput
                multiline={true}
                onChange={setDescription}
                styleObj={styles.textInput}
                toFocus={isFocused}
                placeholder="Enter description"
                value={description}
              />
              {image ? (
                <View style={styles.imageContainer}>
                  <Image style={styles.image} source={{ uri: image }} />
                  <TouchableOpacity onPress={() => setImage(null)}>
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
            disabled={loading}
            onPress={handlePost}
            title="Post"
            styleObject={{ btn: styles.btn, btnText: styles.btnText }}
            underlayColor={colors.primaryWithoutOpacity}
          />
        </>
      )}
      {loading && <Loader visible={loading} />}
      <View style={styles.errorContainer}>
        {!loading && error && (
          <Error error={error} styleObj={styles.errorText} />
        )}
      </View>
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
