import React, { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  collection,
  query,
  getDocs,
  orderBy,
  startAfter,
  limit,
  getDoc,
  doc,
} from "firebase/firestore";
import { Dimensions } from "react-native";

// Own Dependecies
import { AuthContext } from "../context/AuthContext";
import colors from "../themes/colors";
import { db } from "../firebase/config";

const { height, width } = Dimensions.get("window");

function PostsScreen({ navigation }) {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);

  useEffect(() => {
    const fetching = async () => {
      try {
        const q = query(
          collection(db, "users", user.uid, "posts"),
          orderBy("timestamp"),
          limit(5)
        );
        const docs = await getDocs(q);
        const mappedDocs = docs.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));
        const docSnap = await getDoc(
          doc(db, "posts", mappedDocs[mappedDocs.length - 1].id)
        );

        setLastVisible(docSnap);
        setData(mappedDocs);
      } catch (error) {
        console.log(error);
      }
    };
    fetching();
  }, []);

  const retrieveMore = async () => {
    try {
      if (!lastVisible || !lastVisible.exists()) return null;

      const q = query(
        collection(db, "posts"),
        orderBy("timestamp"),
        startAfter(lastVisible),
        limit(5)
      );

      let documentSnapshots = await getDocs(q);
      if (!documentSnapshots.exists()) return;

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
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate("Post Details", { id: item.id })}
            style={styles.listItem}
          >
            <View>
              <Image source={{ uri: item.image }} style={styles.image} />
              <Text style={styles.description}>
                {item.description.split(" ").slice(0, 10).join(" ")}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        ItemSeparatorComponent={() => <View />}
        ListHeaderComponent={() => {
          <Text style={styles.headerText}>Items</Text>;
        }}
        onEndReached={retrieveMore}
        onEndReachedThreshold={0}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: height,
    paddingBottom: 90,
    width: width,
  },
  description: {
    fontSize: 17,
    padding: 20,
  },
  listItem: {
    alignItems: "center",
    justifyContent: "center",
    width: width,
  },
  image: {
    width: "100%",
    height: 500,
  },
});

export default PostsScreen;
