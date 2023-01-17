import React, { useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { collection, query, onSnapshot } from "firebase/firestore";
import { Dimensions } from "react-native";

// Own Dependecies
import { AuthContext } from "../context/AuthContext";
import Button from "../components/UI/Button";
import colors from "../themes/colors";
import useApi from "../api/useApi";

function ProfileScreen(props) {
  const { user } = useContext(AuthContext);

  const { data, setData } = useApi({
    type: "documents",
    name: "posts",
    realTime: true,
    queryFilter: ["user.userId", "==", user.uid],
  });

  console.log(data);

  return (
    <View style={styles.container}>
      <View style={styles.userInfoContainer}>
        <Image
          source={require("../assets/images/person.jpg")}
          style={styles.userInfoImage}
        />
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
        <View style={styles.postGrid}>
          {data &&
            Array.isArray(data) &&
            data.length > 0 &&
            data.map((el, i) => (
              <View key={el.id}>
                <Image
                  source={{ uri: el.image }}
                  style={[styles.postGridImage]}
                />
              </View>
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
  },
  btn: {
    backgroundColor: colors.grey,
    marginTop: 15,
    width: 200,
  },
  btnText: {
    color: colors.dark,
  },
  postGridContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  postGrid: {
    borderTopColor: colors.grey,
    borderTopWidth: 0.4,
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
    marginLeft: 20,
    marginTop: 10,
  },
  userInfoName: {
    fontSize: 18,
  },
});

export default ProfileScreen;
