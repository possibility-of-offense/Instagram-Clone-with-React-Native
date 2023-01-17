import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { collection, query, onSnapshot } from "firebase/firestore";
import { Dimensions } from "react-native";

// Own Dependecies
import colors from "../themes/colors";
import useApi from "../api/useApi";

function HomeScreen(props) {
  // const { data, setData } = useApi({
  //   type: "documents",
  //   name: "posts",
  //   realTime: true,
  // });

  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <View style={styles.postGridContainer}>
        {/* <View style={styles.postGrid}>
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
        </View> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
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
});

export default HomeScreen;
