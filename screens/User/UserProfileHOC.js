import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

// Own Dependencies
import Button from "../../components/UI/Button";
import colors from "../../themes/colors";
import Loader from "../../components/UI/Loader";
import pluralizeWord from "../../helpers/pluralizeWord";
import UserImage from "../../components/UI/UserImage";
import UserProfileTab from "../../components/UI/Tab/UserProfileTab";

function UserProfileHOC({
  anotherUserRoutes = false,
  alreadyFollowed = null,
  error,
  image,
  loading,
  handleFollow = null,
  postsData,
  showEdit,
  user,
  userData,
}) {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <ScrollView>
      <View style={styles.container}>
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.userInfoContainer}>
          <UserImage image={image} styles={styles.userInfoImage} />
          <View style={styles.userInfoNameContainer}>
            <Text style={styles.userInfoName}>
              {user?.displayName || user?.username || user?.email}
            </Text>

            {userData?.bio && (
              <Text style={{ marginTop: 10 }}>{userData?.bio}</Text>
            )}
            {handleFollow ? (
              // prettier-ignore
              !alreadyFollowed ? (
                <Button
                  onPress={handleFollow}
                  title="Follow"
                  styleObject={{
                    btn: styles.followBtn,
                    btnText: styles.followBtnText,
                  }}
                  underlayColor={colors.primaryWithoutOpacity}
                />
              ) : (
                <Button
                  disabled={true}
                  styleObject={{
                    btn: styles.alreadyFollowedBtn,
                    btnText: styles.alreadyFollowedBtnText,
                  }}
                  title="Already followed"
                />
              )
            ) : null}
            {showEdit && (
              <Button
                onPress={() => navigation.navigate("Edit Profile")}
                styleObject={{
                  btn: styles.editBtn,
                  btnText: styles.editBtnText,
                }}
                title="Edit Profile"
                underlayColor={colors.lightGrey}
              />
            )}
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
                {!anotherUserRoutes ? (
                  <>
                    <UserProfileTab
                      title={postsData.length}
                      subTitle="Posts"
                      onPress={() => navigation.navigate("All Posts")}
                    />
                    <UserProfileTab
                      onPress={() => {
                        navigation.navigate("Profile", {
                          screen: "Followers",
                          params: {
                            userId: user.uid,
                          },
                        });
                      }}
                      title={userData?.followers || 0}
                      subTitle="Followers"
                    />
                    <UserProfileTab
                      onPress={() => {
                        navigation.navigate("Profile", {
                          screen: "Following",
                          params: {
                            userId: user.uid,
                          },
                        });
                      }}
                      title={userData?.following || 0}
                      subTitle="Following"
                    />
                  </>
                ) : (
                  <>
                    <UserProfileTab
                      title={user?.posts}
                      subTitle="Posts"
                      onPress={() =>
                        navigation.navigate("Search", {
                          screen: "Another User Posts",
                          params: {
                            id: user.userId,
                          },
                        })
                      }
                    />
                    <UserProfileTab
                      onPress={() => {
                        navigation.navigate("Profile", {
                          screen: "Followers",
                          params: {
                            userId: id,
                          },
                        });
                      }}
                      title={user?.followers || 0}
                      subTitle="Followers"
                    />
                    <UserProfileTab
                      onPress={() => {
                        navigation.navigate("Profile", {
                          screen: "Following",
                          params: {
                            userId: id,
                          },
                        });
                      }}
                      title={user?.following || 0}
                      subTitle="Following"
                    />
                  </>
                )}
              </View>
              {Array.isArray(postsData) && postsData.length > 0 && (
                <View style={styles.checkAllBtnContainer}>
                  <Text style={styles.postsHeading}>
                    {postsData.length} most recent{" "}
                    {pluralizeWord("post", postsData.length, false)}!
                  </Text>
                  <Button
                    onPress={
                      !anotherUserRoutes
                        ? () => navigation.navigate("All Posts")
                        : () =>
                            navigation.navigate("Search", {
                              screen: "Another User Posts",
                              params: {
                                id: route.params.id,
                              },
                            })
                    }
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
                      onPress={
                        !anotherUserRoutes
                          ? () =>
                              navigation.navigate("Post Details", { id: el.id })
                          : () =>
                              navigation.navigate("Search", {
                                screen: "Another Post Details",
                                params: { id: el.id, userId: el.userId },
                              })
                      }
                    >
                      <Image
                        source={{ uri: el.postImage }}
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

export default UserProfileHOC;
