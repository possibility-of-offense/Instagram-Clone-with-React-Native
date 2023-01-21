import React, { useCallback, useState } from "react";
import { Image, Text, StyleSheet, View, FlatList } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { collection, getDocs, query, where } from "firebase/firestore";

// Own Dependencies
import { db } from "../../firebase/config";
import Loader from "../../components/UI/Loader";
import Button from "../../components/UI/Button";

function FollowingScreen({ navigation, route }) {
  const { userId } = route.params;

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setError(false);
      setLoading(false);

      const fetching = async () => {
        setLoading(true);
        try {
          const usersDocs = await getDocs(
            query(collection(db, "following"), where("userId", "==", userId))
          );

          setUsers(
            usersDocs.docs.map((user) => ({
              id: user.data().userToFollow.userId,
              image: user.data().userToFollow.image,
              username:
                user.data().userToFollow.email ||
                user.data().userToFollow.username,
            }))
          );
          setLoading(false);
        } catch (error) {
          setError(`Couldn't get users!`);
          setLoading(false);
        }
      };

      fetching();
    }, [route])
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader visible={true} />
      ) : (
        <View>
          {error && <Text style={styles.error}>{error}</Text>}
          <FlatList
            data={users}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <View key={item.id} style={styles.user}>
                  <View style={styles.imageContainer}>
                    {item.image ? (
                      <Image
                        source={{ uri: item.image }}
                        style={styles.image}
                      />
                    ) : (
                      <Image
                        source={require("../../assets/images/person.jpg")}
                        style={styles.image}
                      />
                    )}
                  </View>
                  <Text>{item.username}</Text>
                  <Button
                    title="Check User"
                    onPress={() =>
                      navigation.navigate("Search", {
                        screen: "Another User",
                        params: {
                          id: item.id,
                        },
                      })
                    }
                  />
                </View>
              );
            }}
            ItemSeparatorComponent={() => (
              <View
                style={{ borderBottomWidth: 1, borderBottomColor: "#ddd" }}
              />
            )}
            onEndReachedThreshold={0}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  error: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    paddingTop: 15,
  },
  image: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  imageContainer: {
    overflow: "hidden",
  },
  user: {
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
  },
});

export default FollowingScreen;
