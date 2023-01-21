import { Dimensions } from "react-native";
import React, { useCallback, useContext, useState } from "react";
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
  orderBy,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";

// Own Dependecies
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/UI/Button";
import colors from "../../themes/colors";
import { db } from "../../firebase/config";
import Loader from "../../components/UI/Loader";
import pluralizeWord from "../../helpers/pluralizeWord";
import UserProfileTab from "../../components/UI/Tab/UserProfileTab";

// Helpers

function UserProfileScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const [postsData, setPostsData] = useState([]);

  const [userData, setUserData] = useState({});
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setImage(user.photoURL);

      const fetchData = async () => {
        setLoading(true);

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
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
              setPostsData(mapped);
              setLoading(false);
            },
            (error) => {
              setError("Error while getting posts!");
              setLoading(false);
            }
          );

          return () => unsub();
        } catch (error) {
          setError("Error while getting users info!");
          setLoading(false);
        }
      };
      fetchData();
    }, [route])
  );

  return (
    <ScrollView>
      <View style={styles.container}>
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.userInfoContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.userInfoImage} />
          ) : (
            <Image
              source={require("../../assets/images/person.jpg")}
              style={styles.userInfoImage}
            />
          )}
          <View style={styles.userInfoNameContainer}>
            <Text style={styles.userInfoName}>
              {user.displayName || user.email}
            </Text>
            {userData?.bio && (
              <Text style={{ marginTop: 10 }}>{userData?.bio}</Text>
            )}
            <Button
              onPress={() => navigation.navigate("Edit Profile")}
              styleObject={{ btn: styles.editBtn, btnText: styles.editBtnText }}
              title="Edit Profile"
              underlayColor={colors.lightGrey}
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
                  title={postsData.length}
                  subTitle="Posts"
                  onPress={() => navigation.navigate("All Posts")}
                />
                <UserProfileTab
                  onPress={() => {
                    navigation.navigate("Followers");
                  }}
                  title={userData?.followers || 0}
                  subTitle="Followers"
                />
                <UserProfileTab
                  onPress={() => {
                    navigation.navigate("Following");
                  }}
                  title={userData?.following || 0}
                  subTitle="Following"
                />
              </View>
              {Array.isArray(postsData) && postsData.length > 0 && (
                <View style={styles.checkAllBtnContainer}>
                  <Text style={styles.postsHeading}>
                    {postsData.length} most recent{" "}
                    {pluralizeWord("post", postsData.length, false)}!
                  </Text>
                  <Button
                    onPress={() => navigation.navigate("All Posts")}
                    styleObject={{
                      btn: styles.checkAllBtn,
                      btnText: styles.checkAllBtnText,
                    }}
                    title="Check All Posts"
                    underlayColor={colors.primaryWithoutOpacity}
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
