import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createDrawerNavigator,
  useDrawerStatus,
} from "@react-navigation/drawer";

// Own Dependencies

import HomeScreen from "./HomeScreen";
import { useAuth } from "../hooks/useAuth";
import { useFocusEffect } from "@react-navigation/native";
import UserImage from "../components/UI/UserImage";
import { collection, getDocs, orderBy, where } from "firebase/firestore";
import { db } from "../firebase/config";
import Loader from "../components/UI/Loader";
import colors from "../themes/colors";

const Drawer = createDrawerNavigator();

function Notifications({ navigation, route }) {
  const { user } = useAuth();

  const isOpen = useDrawerStatus() === "open";

  const [notificationState, setNotificationState] = useState({
    error: false,
    loading: false,
    notifications: [],
  });

  const fetching = async () => {
    setNotificationState((prev) => ({ ...prev, loading: true }));
    try {
      const latest = [];
      const getUsers = await getDocs(
        collection(db, "users", user?.uid, "notifications")
      );

      for (let user of getUsers.docs) {
        const getPosts = await getDocs(
          collection(db, "notifications"),
          where("userId", "==", user.followedUser),
          orderBy("timestamp", "desc")
        );
        latest.push(
          ...getPosts.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      }

      const all = notificationState.notifications.concat(latest);
      const filter = [];

      for (let notification of all) {
        if (!filter.find((el) => el.id === notification.id)) {
          filter.push(notification);
        }
      }
      setNotificationState((prev) => ({
        ...prev,
        loading: false,
        notifications: filter,
      }));
    } catch (error) {
      setNotificationState((prev) => ({
        ...prev,
        loading: false,
        error: `Couldn't get notifications! Try again!`,
      }));
    }
  };

  return (
    <>
      <Text
        style={{ color: colors.primary, margin: 6, textAlign: "center" }}
        onPress={fetching}
      >
        Show Notifications
      </Text>
      {notificationState.loading ? (
        <Loader visible={true} />
      ) : (
        <FlatList
          data={notificationState.notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <View key={item.id} style={styles.listItem}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Search", {
                      screen: "Another Post Details",
                      params: {
                        userId: item.userId,
                        id: item.postId,
                      },
                    })
                  }
                >
                  <View style={styles.listItemBody}>
                    <UserImage image={item.image} styles={styles.image} />
                    <Text style={styles.text}>
                      <Text style={{ fontWeight: "bold" }}>
                        {item.postDescription}
                      </Text>{" "}
                      by {item.username}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
          ItemSeparatorComponent={() => (
            <View style={{ borderBottomWidth: 1, borderBottomColor: "#ddd" }} />
          )}
          onEndReachedThreshold={0}
        />
      )}
    </>
  );
}

function HomeNavigationDrawer(props) {
  return (
    <Drawer.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ unmountOnBlur: true }}
    >
      <Drawer.Screen name="HomeScreen" component={HomeScreen} />
      <Drawer.Screen name="Notifications" component={Notifications} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  listItem: {
    backgroundColor: colors.white,
    borderTopColor: colors.dark,
    borderTopWidth: 1,
    flexDirection: "column",
    padding: 10,
    paddingRight: 20,
  },
  listItemBody: {
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 30,
  },
  text: {
    marginLeft: 10,
  },
});

export default HomeNavigationDrawer;
