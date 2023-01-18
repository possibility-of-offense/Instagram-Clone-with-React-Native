import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  collection,
  query,
  onSnapshot,
  getDocs,
  orderBy,
  startAfter,
  limit,
  getDoc,
  doc,
} from "firebase/firestore";
import { Dimensions } from "react-native";

// Own Dependecies
import colors from "../themes/colors";
import useApi from "../api/useApi";
import { db } from "../firebase/config";

const { height, width } = Dimensions.get("window");

function HomeScreen(props) {
  // const { data, setData } = useApi({
  //   type: "documents",
  //   name: "posts",
  //   realTime: true,
  // });

  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

  // useEffect(() => {
  //   const fetching = async () => {
  //     try {
  //       const q = query(
  //         collection(db, "posts"),
  //         orderBy("timestamp"),
  //         limit(5)
  //       );
  //       const docs = await getDocs(q);
  //       const mappedDocs = docs.docs.map((document) => ({
  //         id: document.id,
  //         ...document.data(),
  //       }));
  //       const docSnap = await getDoc(
  //         doc(db, "posts", mappedDocs[mappedDocs.length - 1].id)
  //       );

  //       setLastVisible(docSnap);
  //       setData(mappedDocs);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetching();
  // }, []);

  const retrieveMore = async () => {
    try {
      const q = query(
        collection(db, "posts"),
        orderBy("timestamp"),
        startAfter(lastVisible),
        limit(5)
      );

      let documentSnapshots = await getDocs(q);
      if (documentSnapshots.docs.length === 0) return;

      const mappedDocs = documentSnapshots.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      const docSnap = await getDoc(
        doc(db, "posts", mappedDocs[mappedDocs.length - 1].id)
      );

      setLastVisible(docSnap);
      setData((prev) => prev.concat(mappedDocs));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Home</Text>
      {/* <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={{
              height: 140,
              width: width,
              borderWidth: 0.2,
              borderColor: "#000",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>
              (ID: {item.id}) {item.description}
            </Text>
          </View>
        )}
        ListHeaderComponent={() => {
          <Text style={styles.headerText}>Items</Text>;
        }}
        onEndReached={retrieveMore}
        onEndReachedThreshold={0}
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
    fontSize: 20,
    padding: 10,
    textAlign: "center",
  },
});

export default HomeScreen;
