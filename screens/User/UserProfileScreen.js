import { Dimensions } from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { StyleSheet } from "react-native";
import {
  collection,
  query,
  limit,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

// Own Dependecies
import { AuthContext } from "../../context/AuthContext";
import colors from "../../themes/colors";
import { db } from "../../firebase/config";
import UserProfileHOC from "./UserProfileHOC";

// Helpers

function UserProfileScreen({ route }) {
  const { user } = useContext(AuthContext);

  const [userState, setUserState] = useState({
    error: false,
    loading: false,
    posts: [],
    userData: {},
    userImage: "",
  });

  useFocusEffect(
    useCallback(() => {
      setUserState((prev) => ({ ...prev, image: user.photoURL }));

      const fetchData = async () => {
        setUserState((prev) => ({ ...prev, loading: true }));

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserState((prev) => ({ ...prev, userData: userDoc.data() }));
          }
          const q = query(
            collection(db, "users", user.uid, "posts"),
            limit(6),
            orderBy("timestamp")
          );
          const unsub = onSnapshot(
            q,
            (snapshot) => {
              const documents = snapshot;
              const mapped = documents.docs.map((document) => ({
                id: document.id,
                ...document.data(),
              }));
              setUserState((prev) => ({
                ...prev,
                posts: mapped,
                loading: false,
              }));
            },
            (error) => {
              setError("Error while getting posts!");
              setLoading(false);
            }
          );
          return () => unsub();
        } catch (error) {
          setUserState((prev) => ({
            ...prev,
            error: "Error while getting users info!",
            loading: true,
          }));
        }
      };
      fetchData();
    }, [route])
  );

  return (
    <UserProfileHOC
      error={userState.error}
      image={userState.image}
      loading={userState.loading}
      postsData={userState.posts}
      showEdit={true}
      user={user}
      userData={userState.userData}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "flex-start",
  },
  checkAllBtnContainer: {
    alignItems: "center",
    borderTopColor: colors.lightGrey,
    borderTopWidth: 0.4,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 5,
    paddingBottom: 15,
    paddingRight: 15,
    width: "100%",
  },
  checkAllBtn: {
    backgroundColor: colors.primary,
    marginLeft: 20,
    width: 150,
  },
  checkAllBtnText: {
    color: colors.white,
  },
  editBtn: {
    backgroundColor: colors.grey,
    marginTop: 15,
    flex: 1,
  },
  editBtnText: {
    color: colors.dark,
  },
  error: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    paddingTop: 15,
  },
  loaderContainer: {
    width: "100%",
    height: 100,
  },
  postGridContainer: {
    alignItems: "center",
    borderTopColor: colors.lightGrey,
    borderTopWidth: 0.4,
    justifyContent: "center",
    paddingBottom: 20,
  },
  postGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  postGridImage: {
    alignSelf: "flex-start",
    borderColor: colors.white,
    borderWidth: 2,
    width: Dimensions.get("window").width * 0.333,
    height: 140,
  },
  postsHeading: {
    fontSize: 18,
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 20,
    width: "100%",
  },
  tabs: {
    borderTopColor: colors.lightGrey,
    borderTopWidth: 0.4,
    flexDirection: "row",
    padding: 10,
    paddingBottom: 15,
  },
  userInfoContainer: {
    flexDirection: "row",
    padding: 25,
  },
  userInfoImage: {
    borderRadius: 40,
    height: 80,
    width: 80,
  },
  userInfoNameContainer: {
    flex: 1,
    marginLeft: 30,
    marginTop: 10,
    marginRight: 5,
  },
  userInfoName: {
    fontSize: 18,
  },
});

export default UserProfileScreen;
