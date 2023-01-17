import React, { useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dimensions } from "react-native";

// Own Dependecies
import { AuthContext } from "../context/AuthContext";
import Button from "../components/UI/Button";
import colors from "../themes/colors";
import useApi from "../api/useApi";
import UserProfileTab from "../components/UI/Tab/UserProfileTab";

function UserProfileScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const { data: posts, setData } = useApi({
    type: "documents",
    name: "posts",
    realTime: true,
    queryFilter: ["user.userId", "==", user.uid],
  });

  const { data: userInfo } = useApi({
    type: "document",
    name: "users",
    realTime: false,
    id: user.uid,
  });

  return (
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
            styleObject={{ btn: styles.btn, btnText: styles.btnText }}
            title="Edit Profile"
          />
        </View>
      </View>
      <View style={styles.postGridContainer}>
        <View style={styles.tabs}>
          <UserProfileTab title={userInfo?.posts} subTitle="Posts" />
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
        <View style={styles.postGrid}>
          {posts &&
            Array.isArray(posts) &&
            posts.length > 0 &&
            posts.map((el, i) => (
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
            ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: "flex-start",
  },
  btn: {
    backgroundColor: colors.grey,
    marginTop: 15,
    flex: 1,
  },
  btnText: {
    color: colors.dark,
  },
  postGridContainer: {
    alignItems: "center",
    borderTopColor: colors.lightGrey,
    borderTopWidth: 0.4,
    justifyContent: "center",
  },
  postGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 15,
  },
  postGridImage: {
    alignSelf: "flex-start",
    borderColor: colors.white,
    borderWidth: 2,
    width: Dimensions.get("window").width * 0.333,
    height: 140,
  },
  tabs: {
    borderBottomColor: colors.grey,
    borderBottomWidth: 0.4,
    flexDirection: "row",
    padding: 10,
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
