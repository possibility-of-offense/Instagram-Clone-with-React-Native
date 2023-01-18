import { Dimensions } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  collection,
  query,
  limit,
  where,
  startAt,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

// Own Dependecies
import { AuthContext } from "../context/AuthContext";
import Button from "../components/UI/Button";
import colors from "../themes/colors";
import { db } from "../firebase/config";
import Loader from "../components/UI/Loader";
import useApi from "../api/useApi";
import UserProfileTab from "../components/UI/Tab/UserProfileTab";

// Helpers
const defineWord = (word, len) => (len === 1 ? word : word + "s");

function UserProfileScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const { data: userInfo } = useApi({
    type: "document",
    name: "users",
    realTime: true,
    id: user.uid,
  });

  const [postsData, setPostsData] = useState([]);
  const [lastDocumentSnapshot, setLastDocumentSnapshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // REFACTOR add error handling

    const fetching = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "posts"),
          where("user.userId", "==", user?.uid.trim()),
          limit(6),
          orderBy("timestamp"),
          startAt(lastDocumentSnapshot || 0)
        );

        onSnapshot(q, (snapshot) => {
          const documents = snapshot;
          const mapped = documents.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }));
          setPostsData(mapped);
          setLoading(false);
        });
      } catch (error) {
        setError("Error whilegetting posts!");
        setLoading(false);
      }
    };
    fetching();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.userInfoContainer}>
          {user.photoUrl ? (
            <Image
              source={require("../assets/images/person.jpg")}
              style={styles.userInfoImage}
            />
          ) : (
            <Image
              source={require("../assets/images/person.jpg")}
              style={styles.userInfoImage}
            />
          )}
          <View style={styles.userInfoNameContainer}>
            <Text style={styles.userInfoName}>
              {user.email || user.displayName}
            </Text>
            <Button
              styleObject={{ btn: styles.editBtn, btnText: styles.editBtnText }}
              title="Edit Profile"
            />
          </View>
        </View>
        <View style={styles.postGridContainer}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <Loader visible={true} />
            </View>
          ) : (
            <>
              <View style={styles.tabs}>
                <UserProfileTab
                  title={postAdded ? userInfo?.posts + 1 : userInfo?.posts}
                  subTitle="Posts"
                />
                <UserProfileTab
                  onPress={() => {
                    navigation.navigate("Followers");
                  }}
                  title={userInfo?.followers}
                  subTitle="Followers"
                />
                <UserProfileTab
                  onPress={() => {
                    navigation.navigate("Followers");
                  }}
                  title={userInfo?.following}
                  subTitle="Following"
                />
              </View>
              {Array.isArray(postsData) && postsData.length > 0 && (
                <View style={styles.checkAllBtnContainer}>
                  <Text style={styles.postsHeading}>
                    {postsData.length} most recent{" "}
                    {defineWord("post", postsData.length)}!
                  </Text>
                  <Button
                    styleObject={{
                      btn: styles.checkAllBtn,
                      btnText: styles.checkAllBtnText,
                    }}
                    title="Check All Posts"
                  />
                </View>
              )}
              <View style={styles.postGrid}>
                {postsData &&
                Array.isArray(postsData) &&
                postsData.length > 0 ? (
                  postsData.map((el, i) => (
                    <TouchableOpacity
                      key={el.id}
                      onPress={() =>
                        navigation.navigate("Post Details", { id: el.id })
                      }
                    >
                      <Image
                        source={{ uri: el.image }}
                        style={[styles.postGridImage]}
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.postsHeading}>No posts yet!</Text>
                )}
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
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
