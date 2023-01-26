import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Dimensions } from "react-native";

// Own Dependencies

import { AuthContext } from "../context/AuthContext";
import Button from "../components/UI/Button";
import { db } from "../firebase/config";
import UserToFollowModal from "../components/UI/Modal/UserToFollowModal";

// Own Dependecies
import colors from "../themes/colors";
import Loader from "../components/UI/Loader";
import HomeUsersFeed from "./HomeUsersFeed";

const { height, width } = Dimensions.get("window");

function HomeScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);

  const [followingState, setFollowingState] = useState({
    error: false,
    followingUsers: [],
    homeScreenFollowingUser: null,
    isThereAnyFollowings: true,
    loading: false,
  });

  useEffect(() => {
    if (followingState.homeScreenFollowingUser) {
      updateDoc(doc(db, "users", user.uid), {
        homeFollowingUser: followingState.homeScreenFollowingUser,
      })
        .then((d) => d)
        .catch((err) => console.log(err));
    }
  }, [followingState.homeScreenFollowingUser]);

  useFocusEffect(
    useCallback(() => {
      const fetching = async () => {
        try {
          setFollowingState((prev) => ({ ...prev, loading: true }));

          const followingDocs = await getDocs(
            query(collection(db, "following"), where("userId", "==", user.uid))
          );

          if (followingDocs.docs.length > 0) {
            setFollowingState((prev) => ({
              ...prev,
              followingUsers: followingDocs.docs.map((d) => ({
                id: d.id,
                ...d.data(),
              })),
              isThereAnyFollowings: true,
            }));
          } else {
            setFollowingState((prev) => ({
              ...prev,
              isThereAnyFollowings: false,
            }));
          }

          setFollowingState((prev) => ({ ...prev, loading: false }));
        } catch (error) {
          setFollowingState((prev) => ({
            ...prev,
            error: `Error ocurred!`,
            loading: false,
          }));
        }
      };
      fetching();
    }, [route])
  );

  return (
    <SafeAreaView style={styles.container}>
      {followingState.loading ? (
        <Loader visible={true} />
      ) : followingState.followingUsers.length > 0 ? (
        <Button
          onPress={() => setShowModal(true)}
          title="Pick user who you want to see when on the Home Page"
          styleObject={{ btn: styles.openModal, btnText: styles.openModalText }}
          underlayColor={colors.primaryWithoutOpacity}
        />
      ) : (
        <Text style={styles.text}>No users which have been followed!</Text>
      )}
      <UserToFollowModal
        modalActions={{
          showModal,
          setShowModal,
        }}
        following={followingState.followingUsers}
        setHomeFollowing={(homeScreenFollowingUser) =>
          setFollowingState((prev) => ({ ...prev, homeScreenFollowingUser }))
        }
      />
      {followingState.followingUsers.length > 0 && <HomeUsersFeed />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: height,
    width: width,
  },
  openModal: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    width: "80%",
    marginVertical: 15,
  },
  openModalText: {
    color: colors.white,
  },
  text: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
});

export default HomeScreen;
