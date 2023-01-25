import React, { useCallback, useContext, useState } from "react";
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
import { AuthContext } from "../../context/AuthContext";
import colors from "../../themes/colors";
import { db } from "../../firebase/config";
import { useFocusEffect } from "@react-navigation/native";
import Button from "../../components/UI/Button";
import LazyLoadListItems from "../../components/UI/ListItems/LazyLoadListItems";
import PostsHOC from "./PostsHOC";

const { height, width } = Dimensions.get("window");

function PostsScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [error, setError] = useState(false);

  const [postsState, setPostsState] = useState({
    error: false,
    loading: false,
    lastVisible: null,
    posts: [],
    user: {},
  });

  useFocusEffect(
    useCallback(() => {
      const fetching = async () => {
        setPostsState((prev) => ({ ...prev, loading: true, error: false }));

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

          setPostsState((prev) => ({
            ...prev,
            loading: false,
            lastVisible: docSnap,
            posts: mappedDocs,
          }));
        } catch (error) {
          setPostsState((prev) => ({
            ...prev,
            error: `Couldn't get the posts`,
            loading: false,
          }));
        }
      };
      fetching();
    }, [route])
  );

  const retrieveMore = async () => {
    try {
      if (!postsState.lastVisible || !postsState.lastVisible.exists())
        return null;

      setPostsState((prev) => ({ ...prev, loading: true, error: false }));
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

      setPostsState((prev) => ({
        ...prev,
        loading: false,
        lastVisible: docSnap,
        posts: mappedDocs,
      }));
    } catch (error) {
      setPostsState((prev) => ({
        ...prev,
        error: `Couldn't get the posts`,
        loading: false,
      }));
    }
  };
  return (
    // <SafeAreaView style={styles.container}>
    //   {error && <Text style={styles.error}>{error}</Text>}
    //   <FlatList
    //     data={data}
    //     keyExtractor={(item) => item.id}
    //     renderItem={({ item }) => (
    //       <TouchableWithoutFeedback
    //         onPress={() => navigation.navigate("Post Details", { id: item.id })}
    //         style={styles.listItem}
    //       >
    //         <View>
    //           <Image source={{ uri: item.image }} style={styles.image} />
    //           <Button
    //             onPress={() =>
    //               navigation.navigate("Post Details", { id: item.id })
    //             }
    //             styleObject={{
    //               btn: styles.seePostBtn,
    //               btnText: styles.seePostBtnText,
    //             }}
    //             title="See Post"
    //           />
    //         </View>
    //       </TouchableWithoutFeedback>
    //     )}
    //     ItemSeparatorComponent={() => <View />}
    //     ListHeaderComponent={() => {
    //       <Text style={styles.headerText}>Items</Text>;
    //     }}
    //     onEndReached={retrieveMore}
    //     onEndReachedThreshold={0}
    //   />
    // </SafeAreaView>
    // <LazyLoadListItems
    //   data={data}
    //   error={error}
    //   styles={styles}
    //   retrieveMore={retrieveMore}
    // />
    <PostsHOC
      error={postsState.error}
      loading={postsState.loading}
      styles={styles}
      posts={postsState.posts}
      retrieveMore={retrieveMore}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    height: height,
    paddingBottom: 90,
    width: width,
  },
  error: {
    color: "red",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
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
  seePostBtn: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    marginVertical: 15,
    marginLeft: 15,
    width: "50%",
  },
  seePostBtnText: {
    color: colors.white,
  },
});

export default PostsScreen;
