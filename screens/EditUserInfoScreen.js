import { updateProfile } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

// Own Dependencies
import AppInput from "../components/UI/Input";
import { auth, db } from "../firebase/config";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/UI/Button";
import colors from "../themes/colors";
import Loader from "../components/UI/Loader";

function EditUserInfoScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const [username, setUsername] = useState(
    () => user.displayName || user.email
  );
  const [invalidUsername, setInvalidUsername] = useState(false);

  const [name, setName] = useState("");
  const [invalidName, setInvalidName] = useState(false);

  const [bio, setBio] = useState("");
  const [invalidBio, setInvalidBio] = useState(false);

  const [errorUpdating, setErrorUpdating] = useState(false);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    if (
      username !== "" &&
      (invalidUsername !== "" || invalidUsername !== false)
    )
      setInvalidUsername(false);

    if (name !== "" && (invalidName !== "" || invalidName !== false))
      setInvalidName(false);

    if (bio !== "" && (invalidBio !== "" || invalidBio !== false))
      setInvalidBio(false);
  }, [username, bio]);

  // Update Profile
  const handleUpdateProfile = async () => {
    if (username === "") return setInvalidUsername("Invalid username");
    if (name === "") return setInvalidName("Invalid name");
    if (bio === "") return setInvalidBio("Invalid bio");

    setLoading(true);
    try {
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      await updateDoc(doc(db, "users", user.uid), {
        bio,
        username,
        name,
      });

      setLoading(false);
    } catch (error) {
      setErrorUpdating(true);
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <Loader visible={true} />
      ) : (
        <View style={styles.form}>
          {errorUpdating && (
            <Text style={styles.networkError}>{errorUpdating}</Text>
          )}

          <Text style={styles.label}>Username</Text>
          <AppInput
            error={invalidUsername}
            onChange={setUsername}
            value={username}
            visible={invalidUsername ? true : false}
          />
          <Text style={styles.helper}>
            This will be shown as the username (the email will be staying the
            same)
          </Text>

          <Text style={styles.label}>Name</Text>
          <AppInput
            error={invalidName}
            onChange={setName}
            value={name}
            visible={invalidName ? true : false}
          />

          <Text style={styles.helper}>
            Help people discover your account by using the name you're known by:
            either your full name, nickname, or business name.
          </Text>

          <Text style={styles.label}>Bio</Text>
          <AppInput
            editable
            error={invalidBio}
            multiline
            numberOfLines={3}
            onChange={setBio}
            styleObj={styles.bio}
            value={bio}
            visible={invalidBio ? true : false}
          />
          <Text style={styles.labelTitle}>Personal information</Text>
          <Text style={styles.helper}>
            Provide your personal information, even if the account is used for a
            business, a pet or something else. This won't be a part of your
            public profile.
          </Text>

          <View style={styles.imageContainer}>
            <Text style={styles.imageContainerText}>Upload an image</Text>
            <Feather name="upload" size={28} color="black" />
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
