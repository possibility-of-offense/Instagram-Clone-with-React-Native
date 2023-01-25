import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { Dimensions, Image, TouchableOpacity } from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { ScrollView, StyleSheet, Text, Alert, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Own Dependencies
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/UI/Button";
import colors from "../../themes/colors";
import { db } from "../../firebase/config";
import Loader from "../../components/UI/Loader";
import pluralizeWord from "../../helpers/pluralizeWord";
import UserProfileTab from "../../components/UI/Tab/UserProfileTab";
import UserProfileHOC from "../User/UserProfileHOC";

function AnotherUserProfileScreen({ navigation, route }) {
  const { id } = route.params;
  const { user } = useContext(AuthContext);

  const [userToFollow, setUserToFollow] = useState(null);
  const [postsOfUser, setPostsOfUser] = useState([]);
  const [alreadyFollowed, setAlreadyFollowed] = useState(false);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setError(false);
      setLoading(false);

      const fetchUser = async () => {
        setLoading(true);
        try {
          const checkIfAlreadyFollowed = await getDocs(
            query(collection(db, "following"), where("userId", "==", user.uid))
          );

          if (checkIfAlreadyFollowed.docs.length > 0) setAlreadyFollowed(true);

          const userDoc = await getDoc(doc(db, "users", id));
          if (userDoc.exists())
            setUserToFollow({ id: userDoc.id, ...userDoc.data() });

          const postsQuery = await getDocs(
            query(
              collection(db, "users", userDoc.id, "posts"),
              where("userId", "==", userDoc.id)
            )
          );
          if (postsQuery.docs.length > 0) {
            setPostsOfUser(
              postsQuery.docs.map((document) => ({
                id: document.id,
                ...document.data(),
              }))
            );
          }

          setLoading(false);
        } catch (error) {
          setLoading(false);
          setError("Error getting user info!");
        }
      };

      fetchUser();

      return () => setUserToFollow(null);
    }, [route])
  );

  const handleFollow = async () => {
    try {
      await runTransaction(db, async (transcation) => {
        await addDoc(collection(db, "following"), {
          userId: user.uid,
          username: user.email || user.displayName,
          image: user.photoURL,
          userToFollow: {
            userId: userToFollow.id,
            username: userToFollow.username || null,
            email: userToFollow.email,
            image: userToFollow.image || null,
          },
        });
        await addDoc(collection(db, "followers"), {
          userId: userToFollow.id,
          username: userToFollow.username || null,
          email: userToFollow.email,
          image: userToFollow.image || null,
          userFollowing: {
            userId: user.uid,
            username: user.email || user.displayName,
            image: user.photoURL,
          },
        });

        transcation.update(doc(db, "users", user.uid), {
          following: increment(1),
        });
        transcation.update(doc(db, "users", userToFollow.id), {
          followers: increment(1),
        });
        setUserToFollow((prev) => ({ ...prev, followers: prev.followers + 1 }));
        setAlreadyFollowed(true);

        Alert.alert(
          "User Added",
          `${userToFollow.username || userToFollow.email} have been followed!`,
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("Search"),
            },
          ]
        );
      });
    } catch (error) {
      setError(`Couldn't follow the user! Try again!`);
    }
  };

  return null;
  // return (
  //   // <UserProfileHOC

  //   // />
  //   // <ScrollView>
  //   //   {loading ? (
  //   //     <Loader visible={true} />
  //   //   ) : (
  //   //     <View style={styles.container}>
  //   //       {error && <Text style={styles.error}>{error}</Text>}
  //   //       <View style={styles.userInfoContainer}>
  //   //         {userToFollow?.image ? (
  //   //           <Image
  //   //             source={{ uri: userToFollow?.image }}
  //   //             style={styles.userInfoImage}
  //   //           />
  //   //         ) : (
  //   //           <Image
  //   //             source={require("../../assets/images/person.jpg")}
  //   //             style={styles.userInfoImage}
  //   //           />
  //   //         )}
  //   //         <View style={styles.userInfoNameContainer}>
  //   //           <Text style={styles.userInfoName}>
  //   //             {userToFollow?.username || userToFollow?.email}
  //   //           </Text>
  //   //           {!alreadyFollowed ? (
  //   //             <Button
  //   //               onPress={handleFollow}
  //   //               title="Follow"
  //   //               styleObject={{
  //   //                 btn: styles.followBtn,
  //   //                 btnText: styles.followBtnText,
  //   //               }}
  //   //               underlayColor={colors.primaryWithoutOpacity}
  //   //             />
  //   //           ) : (
  //   //             <Button
  //   //               disabled={true}
  //   //               styleObject={{
  //   //                 btn: styles.alreadyFollowedBtn,
  //   //                 btnText: styles.alreadyFollowedBtnText,
  //   //               }}
  //   //               title="Already followed"
  //   //             />
  //   //           )}
  //   //           {userToFollow?.bio && (
  //   //             <Text style={{ marginTop: 10 }}>{userToFollow?.bio}</Text>
  //   //           )}
  //   //         </View>
  //   //       </View>
  //   //       <View style={styles.postGridContainer}>
  //   //         {loading ? (
  //   //           <View style={styles.loaderContainer}>
  //   //             <Loader visible={true} />
  //   //           </View>
  //   //         ) : (
  //   //           <>
  //   //             <View style={styles.tabs}>
  //   //               <UserProfileTab
  //   //                 title={userToFollow?.posts}
  //   //                 subTitle="Posts"
  //   //                 onPress={() =>
  //   //                   navigation.navigate("Search", {
  //   //                     screen: "Another User Posts",
  //   //                     params: {
  //   //                       id: userToFollow.userId,
  //   //                     },
  //   //                   })
  //   //                 }
  //   //               />
  //   //               <UserProfileTab
  //   //                 onPress={() => {
  //   //                   navigation.navigate("Profile", {
  //   //                     screen: "Followers",
  //   //                     params: {
  //   //                       userId: id,
  //   //                     },
  //   //                   });
  //   //                 }}
  //   //                 title={userToFollow?.followers || 0}
  //   //                 subTitle="Followers"
  //   //               />
  //   //               <UserProfileTab
  //   //                 onPress={() => {
  //   //                   navigation.navigate("Profile", {
  //   //                     screen: "Following",
  //   //                     params: {
  //   //                       userId: id,
  //   //                     },
  //   //                   });
  //   //                 }}
  //   //                 title={userToFollow?.following || 0}
  //   //                 subTitle="Following"
  //   //               />
  //   //             </View>
  //   //             {Array.isArray(postsOfUser) && postsOfUser.length > 0 ? (
  //   //               <View style={styles.checkAllBtnContainer}>
  //   //                 <Text style={styles.postsHeading}>
  //   //                   {postsOfUser.length} most recent{" "}
  //   //                   {pluralizeWord("post", postsOfUser.length, false)}!
  //   //                 </Text>
  //   //                 <Button
  //   //                   onPress={() =>
  //   //                     navigation.navigate("Search", {
  //   //                       screen: "Another User Posts",
  //   //                       params: {
  //   //                         id: userToFollow.userId,
  //   //                       },
  //   //                     })
  //   //                   }
  //   //                   styleObject={{
  //   //                     btn: styles.checkAllBtn,
  //   //                     btnText: styles.checkAllBtnText,
  //   //                   }}
  //   //                   title="Check All Posts"
  //   //                   underlayColor={colors.primaryWithoutOpacity}
  //   //                 />
  //   //               </View>
  //   //             ) : (
  //   //               <Text
  //   //                 style={[
  //   //                   styles.postGridContainer,
  //   //                   { textAlign: "center", paddingTop: 10, width: "100%" },
  //   //                 ]}
  //   //               >
  //   //                 No posts for the user yet!
  //   //               </Text>
  //   //             )}
  //   //             <View style={styles.postGrid}>
  //   //               {postsOfUser &&
  //   //               Array.isArray(postsOfUser) &&
  //   //               postsOfUser.length > 0 ? (
  //   //                 postsOfUser.map((el, i) => (
  //   //                   <TouchableOpacity
  //   //                     key={el.id}
  //   //                     onPress={() =>
  //   //                       navigation.navigate("Search", {
  //   //                         screen: "Another Post Details",
  //   //                         params: { id: el.id, userId: el.userId },
  //   //                       })
  //   //                     }
  //   //                   >
  //   //                     <Image
  //   //                       source={{ uri: el.image }}
  //   //                       style={[styles.postGridImage]}
  //   //                     />
  //   //                   </TouchableOpacity>
  //   //                 ))
  //   //               ) : (
  //   //                 <Text style={styles.postsHeading}>No posts yet!</Text>
  //   //               )}
  //   //             </View>
  //   //           </>
  //   //         )}
  //   //       </View>
  //   //     </View>
  //   //   )}
  //   // </ScrollView>
  // );
}

const styles = StyleSheet.create({
  alreadyFollowedBtn: {
    backgroundColor: colors.grey,
    marginTop: 15,
  },
  alreadyFollowedBtnText: {
    color: colors.dark,
  },
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
  followBtn: {
    backgroundColor: colors.primary,
    marginTop: 10,
  },
  followBtnText: {
    color: colors.white,
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

export default AnotherUserProfileScreen;
