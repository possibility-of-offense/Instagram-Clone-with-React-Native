import { AntDesign } from "@expo/vector-icons";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Constants from "expo-constants";
import React, { useCallback, useContext, useState } from "react";
import {
  Image,
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Own Dependencies
import { AuthContext } from "../../context/AuthContext";
import Button from "../../components/UI/Button";
import colors from "../../themes/colors";
import { db } from "../../firebase/config";
import Loader from "../../components/UI/Loader";

function FollowingScreen({ navigation, route }) {
  const { userId } = route.params;
  const { user: contextUser } = useContext(AuthContext);

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNavigate = () => {
    if (userId === contextUser.uid) {
      navigation.navigate("Profile", {
        screen: "Profile Info",
      });
    } else {
      navigation.navigate("Search", {
        screen: "Another User",
        params: {
          id: userId,
        },
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      setError(false);
      setLoading(false);

      const fetching = async () => {
        setLoading(true);
        try {
          const [usersDocs, userDoc] = await Promise.all([
            getDocs(
              query(collection(db, "following"), where("userId", "==", userId))
            ),
            getDoc(doc(db, "users", userId)),
          ]);

          setUsers(
            usersDocs.docs.map((user) => ({
              id: user.data().followerOfUser.userId,
              image: user.data().followerOfUser.image,
              username:
                user.data().followerOfUser.username ||
                user.data().followerOfUser.email,
            }))
          );
          setUser(userDoc.data());
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
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loader visible={true} />
      ) : (
        <View>
          {error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.header}>
            <AntDesign
              color="black"
              name="back"
              onPress={handleNavigate}
              size={29}
            />
            <Text style={styles.headerText}>
              {user?.username || user?.email} is following:
            </Text>
          </View>
          {users.length > 0 ? (
            <FlatList
              data={users}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <TouchableWithoutFeedback
                    onPress={() =>
                      navigation.navigate("Search", {
                        screen: "Another User",
                        params: {
                          id: item.id,
                        },
                      })
                    }
                  >
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
                      <Text style={styles.username}>{item.username}</Text>
                      <Button
                        onPress={() =>
                          navigation.navigate("Search", {
                            screen: "Another User",
                            params: {
                              id: item.id,
                            },
                          })
                        }
                        title="Check User"
                        styleObject={{
                          btn: styles.checkBtn,
                          btnText: styles.checkBtnText,
                        }}
                        underlayColor={colors.primaryWithoutOpacity}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                );
              }}
              ItemSeparatorComponent={() => (
                <View
                  style={{ borderBottomWidth: 1, borderBottomColor: "#ddd" }}
                />
              )}
              onEndReachedThreshold={0}
            />
          ) : (
            <Text style={styles.backupMsg}>No one is being following!</Text>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backupMsg: {
    fontSize: 17,
    padding: 6,
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    borderBottomColor: colors.dark,
    borderBottomWidth: 2,
    backgroundColor: colors.white,
    flexDirection: "row",
    paddingLeft: 10,
    paddingVertical: 10,
    paddingTop: Constants.statusBarHeight,
  },
  headerText: {
    fontSize: 18,
    marginLeft: 16,
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
  username: {
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  checkBtn: {
    backgroundColor: colors.primary,
    marginLeft: "auto",
  },
  checkBtnText: {
    color: colors.white,
  },
});

export default FollowingScreen;
