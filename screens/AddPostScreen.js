import React, { useState } from "react";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

// Own Dependencies
import Button from "../components/UI/Button";
import colors from "../themes/colors";
import AppInput from "../components/UI/Input";
import { ref, uploadBytes, uploadString } from "firebase/storage";
import { storage } from "../firebase/config";

function AddPostScreen(props) {
  const isFocused = useIsFocused();

  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

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

  // Handle publish post
  const handlePost = async () => {
    try {
      // const storageRef = ref(storage, "test");
      // uploadBytes(storageRef, image, {
      //   contentType: "image/jpg",
      // }).then((snap) => {
      //   console.log(snap);
      // });

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
      const thisUsersNewPostRef = ref(storage, "users/img1");

      uploadBytes(thisUsersNewPostRef, blob).then((snapshot) => {
        // causes crash
        console.log("Uploaded a blob or file!");
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
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
          />
          {image ? (
            <Image style={styles.image} source={{ uri: image }} />
          ) : (
            <TouchableOpacity onPress={pickImage}>
              <MaterialIcons name="add-a-photo" size={32} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Button
        disabled={false}
        onPress={handlePost}
        title="Post"
        styleObject={{ btn: styles.btn, btnText: styles.btnText }}
        underlayColor={colors.primaryWithoutOpacity}
      />
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
  image: { width: 60, height: 60 },
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
