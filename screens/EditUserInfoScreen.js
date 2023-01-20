import { updateProfile } from "firebase/auth";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useFocusEffect } from "@react-navigation/native";

// Own Dependencies
import AppInput from "../components/UI/Input";
import { auth, db, storage } from "../firebase/config";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/UI/Button";
import colors from "../themes/colors";
import Loader from "../components/UI/Loader";

function EditUserInfoScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const [editState, setEditState] = useState({
    name: {
      value: "",
      invalid: false,
    },
    username: {
      value: user.displayName || user.email,
      invalid: false,
    },
    bio: {
      value: "",
      invalid: false,
    },
    image: "",
    error: false,
    loading: null,
  });

  // Fetch user
  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        setEditState((prev) => ({ ...prev, loading: true }));

        try {
          const userObj = await getDoc(doc(db, "users", user.uid));
          const userObjData = userObj.exists() ? userObj.data() : null;

          setEditState({
            loading: false,
            error: false,
            name: {
              invalid: false,
              value: userObjData?.name,
            },
            username: {
              invalid: false,
              value: userObjData?.username,
            },
            bio: {
              invalid: false,
              value: userObjData?.bio,
            },
          });
        } catch (error) {
          setEditState((prev) => ({
            ...prev,
            loading: false,
            error: "Error getting user info!",
          }));
        }
      };
      fetchUser();

      return () => {};
    }, [route])
  );

  // Reset Error / Invalid state
  useEffect(() => {
    if (
      editState.username.value !== "" &&
      (editState.username.invalid !== "" ||
        editState.username.invalid !== false)
    ) {
      setEditState((prev) => ({
        ...prev,
        username: {
          ...prev.username,
          invalid: false,
        },
      }));
    }

    if (
      editState.name.value !== "" &&
      (editState.name.invalid !== "" || editState.name.invalid !== false)
    ) {
      setEditState((prev) => ({
        ...prev,
        name: {
          ...prev.name,
          invalid: false,
        },
      }));
    }

    if (
      editState.bio.value !== "" &&
      (editState.bio.invalid !== "" || editState.bio.invalid !== false)
    ) {
      setEditState((prev) => ({
        ...prev,
        bio: {
          ...prev.bio,
          invalid: false,
        },
      }));
    }
  }, [
    editState.username.value,
    editState.username.invalid,
    editState.name.value,
    editState.name.invalid,
    editState.bio.value,
    editState.bio.invalid,
  ]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      setEditState((prev) => ({
        ...prev,
        image: result.assets[0].uri,
      }));
    }
  };

  // Update Profile
  const handleUpdateProfile = async () => {
    if (editState.username.value === "")
      return setEditState((prev) => ({
        ...prev,
        username: { ...editState.username, invalid: true },
      }));
    if (editState.name.value === "")
      return setEditState((prev) => ({
        ...prev,
        name: { ...editState.name, invalid: true },
      }));
    if (editState.bio.value === "")
      return setEditState((prev) => ({
        ...prev,
        bio: { ...editState.bio, invalid: true },
      }));

    // Main logic
    setEditState((prev) => ({ ...prev, loading: true }));
    try {
      let userPostImageRef;
      let url;

      if (editState.image) {
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = function () {
            resolve(xhr.response);
          };
          xhr.onerror = function () {
            reject(new TypeError("Network request failed"));
          };
          xhr.responseType = "blob";
          xhr.open("GET", editState.image, true);
          xhr.send(null);
        });

        userPostImageRef = ref(
          storage,
          `users/${user.uid}/profile/profileImage`
        );

        try {
          await uploadBytes(userPostImageRef, blob);
          url = await getDownloadURL(userPostImageRef);
        } catch (error) {
          throw new Error("Error while uploading the image!");
        }
      }

      await updateProfile(auth.currentUser, {
        displayName: editState.username.value,
        photoURL: url,
      });
      await updateDoc(doc(db, "users", user.uid), {
        bio: editState.bio.value,
        username: editState.username.value,
        name: editState.name.value,
      });

      setEditState((prev) => ({ ...prev, loading: false }));

      navigation.jumpTo("Profile", { screen: "Profile Info" });
    } catch (error) {
      setEditState((prev) => ({
        ...prev,
        loading: false,
        error: "Error occured while updating profile! Try again!",
      }));
    }
  };

  // Handle Change
  const handleChange = (param, text) => {
    setEditState((prev) => ({
      ...prev,
      [param]: {
        invalid: text !== "",
        value: text,
      },
    }));
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      style={styles.container}
    >
      {editState.loading ? (
        <Loader visible={true} />
      ) : (
        <View style={styles.form}>
          {editState.error && (
            <Text style={styles.networkError}>{editState.error}</Text>
          )}

          <Text style={styles.label}>Username</Text>
          <AppInput
            error={editState?.username?.invalid}
            onChange={handleChange.bind(null, "username")}
            value={editState?.username?.value}
            visible={editState?.username?.invalid ? true : false}
          />
          <Text style={styles.helper}>
            This will be shown as the username (the email will be staying the
            same)
          </Text>

          <Text style={styles.label}>Name</Text>
          <AppInput
            error={editState?.name?.invalid}
            onChange={handleChange.bind(null, "name")}
            value={editState?.name?.value}
            visible={editState?.name?.invalid ? true : false}
          />

          <Text style={styles.helper}>
            Help people discover your account by using the name you're known by:
            either your full name, nickname, or business name.
          </Text>

          <Text style={styles.label}>Bio</Text>
          <AppInput
            editable
            error={editState?.bio?.invalid}
            multiline
            numberOfLines={3}
            onChange={handleChange.bind(null, "bio")}
            styleObj={styles.bio}
            value={editState?.bio?.value}
            visible={editState?.bio?.invalid ? true : false}
          />
          <Text style={styles.labelTitle}>Personal information</Text>
          <Text style={styles.helper}>
            Provide your personal information, even if the account is used for a
            business, a pet or something else. This won't be a part of your
            public profile.
          </Text>

          <View style={styles.imageContainer}>
            <Text style={styles.imageContainerText}>Upload an image</Text>
            <TouchableOpacity onPress={pickImage}>
              <Feather name="upload" size={28} color="black" />
            </TouchableOpacity>
          </View>

          <Button
            onPress={handleUpdateProfile}
            styleObject={{
              btn: styles.updateProfileBtn,
              btnText: styles.updateProfileBtnText,
            }}
            title="Update Profile"
            underlayColor={colors.primaryWithoutOpacity}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bio: {
    justifyContent: "flex-start",
    textAlignVertical: "top",
    paddingTop: 10,
  },
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: 15,
  },
  form: {
    paddingVertical: 15,
  },
  imageContainer: {
    alignItems: "center",
    backgroundColor: colors.grey,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    padding: 8,
  },
  imageContainerText: {
    fontSize: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 13,
    marginBottom: 5,
  },
  labelTitle: {
    fontWeight: "bold",
    fontSize: 15,
    color: colors.lightGrey,
  },
  helper: {
    color: colors.lightGrey,
    fontSize: 13,
  },
  networkError: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  updateProfileBtn: {
    backgroundColor: colors.primary,
    marginTop: 20,
  },
  updateProfileBtnText: {
    color: colors.white,
  },
});

export default EditUserInfoScreen;
