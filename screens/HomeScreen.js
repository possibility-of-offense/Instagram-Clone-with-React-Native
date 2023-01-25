import { useFocusEffect } from "@react-navigation/native";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
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
} from "react-native";

import { Dimensions } from "react-native";
import UserToFollowModal from "../components/UI/Modal/UserToFollowModal";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";

// Own Dependecies
import colors from "../themes/colors";

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

  const [following, setFollowing] = useState([]);
  const [homeFollowing, setHomeFollowing] = useState({});

  useEffect(() => {
    if (Object.values(homeFollowing).length > 0) {
      updateDoc(doc(db, "users", user.uid), {
        homeFollowing,
      })
        .then((d) => d)
        .catch((err) => console.log(err));
    }
  }, [homeFollowing]);

  useFocusEffect(
    useCallback(() => {
      const fetching = async () => {
        try {
          await runTransaction(db, async (transcation) => {
            // REFACTOR
            const followingDocs = await getDocs(
              query(
                collection(db, "following"),
                where("userToFollow.userId", "==", user.uid)
              )
            );

            if (followingDocs.docs.length > 0) {
              setFollowingState((prev) => ({
                ...prev,
                isThereAnyFollowings: false,
              }));
            }
          });
          // const followings = await getDocs(
          //   query(
          //     collection(db, "following"),
          //     where("userToFollow.userId", "==", user.uid)
          //   )
          // );

          // const mapped = followings.docs.map((d) => ({
          //   id: d.id,
          //   userId: d.data().userId,
          //   user: {
          //     id: d.data().userToFollow.userId,
          //     username:
          //       d.data().userToFollow.username || d.data().userToFollow.email,
          //   },
          // }));
          // setFollowing(mapped);
        } catch (error) {
          console.log(error);
        }
      };
      fetching();
    }, [route])
  );

  return (
    <SafeAreaView style={styles.container}>
      {following.length > 0 ? (
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Text>Show Modal</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.text}>No users which have been followed!</Text>
      )}
      {!followingState.isThereAnyFollowings && <Text>Test</Text>}
      {/* <UserToFollowModal
        modalActions={{
          showModal,
          setShowModal,
        }}
        following={following}
        setHomeFollowing={setHomeFollowing}
      /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: height,
    width: width,
  },
  text: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "center",
  },
});

export default HomeScreen;
