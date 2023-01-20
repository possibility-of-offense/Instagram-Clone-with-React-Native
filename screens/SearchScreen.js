import React, { useCallback, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// Own Dependencies
import AppInput from "../components/UI/Input";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";
import Button from "../components/UI/Button";
import colors from "../themes/colors";
import Loader from "../components/UI/Loader";
import { useFocusEffect } from "@react-navigation/native";

function SearchScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);

  const [foundResults, setFoundResults] = useState(true);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setError(false);
      setFoundResults(true);
      setLoading(false);
      setSearchTerm("");
      setUsers([]);
    }, [route])
  );

  useEffect(() => {
    if (searchTerm !== "") {
      setError(false);
      setLoading(false);
      setFoundResults(true);
    }
  }, [searchTerm]);

  const handleSearch = async () => {
    if (searchTerm === "") {
      return setError("Fill the input first!");
    }

    setLoading(true);
    setSearchTerm("");

    try {
      const searchResults = await getDocs(collection(db, "users"));
      const mappedSearchResults = searchResults.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      const foundUsers = [];
      mappedSearchResults.forEach((userObj) => {
        if (
          userObj.email.includes(searchTerm) &&
          !userObj.userId.includes(user.uid)
        ) {
          foundUsers.push(userObj);
        }
      });

      if (foundUsers.length > 0) {
        setUsers(foundUsers);
      } else {
        setFoundResults(false);
      }

      setLoading(false);
    } catch (error) {
      setError("Error occured while searching for user! Try again!");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppInput
        error={error}
        onChange={setSearchTerm}
        placeholder="Search for people..."
        placeholderTextColor={colors.dark}
        styleObj={styles.searchInput}
        value={searchTerm}
        visible={error}
      />
      <Button
        onPress={handleSearch}
        title="Search"
        styleObject={{
          btn: styles.searchButton,
          btnText: styles.searchButtonText,
        }}
      />
      <View
        style={[
          !loading && (users.length > 0 || !foundResults)
            ? styles.searchResultsContainer
            : { height: 250 },
        ]}
      >
        {loading ? (
          <Loader visible={true} />
        ) : (
          <>
            {foundResults ? (
              <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <View key={item.id} style={styles.listItem}>
                      <TouchableWithoutFeedback
                        onPress={() =>
                          navigation.navigate("Profile", {
                            screen: "Another User Profile Info",
                            params: {
                              id: item.id,
                            },
                          })
                        }
                      >
                        <View style={styles.listItemBody}>
                          {item.image ? (
                            <Image
                              source={{ uri: item.image }}
                              style={styles.image}
                            />
                          ) : (
                            <Image
                              style={styles.image}
                              source={require("../assets/images/person.jpg")}
                            />
                          )}
                          <Text style={styles.listItemUsername}>
                            {item.email || item.username}
                          </Text>
                        </View>
                      </TouchableWithoutFeedback>
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
            ) : (
              <Text style={styles.noUsersFound}>No users found!</Text>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 15,
    paddingTop: 25,
  },
  image: {
    bordeRadius: 20,
    height: 40,
    width: 40,
  },
  listItem: {
    flexDirection: "column",
    padding: 10,
    paddingRight: 20,
  },
  listItemBody: {
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 30,
  },
  listItemUsername: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 15,
  },
  noUsersFound: {
    fontSize: 17,
    marginTop: 10,
    textAlign: "center",
  },
  searchInput: {
    backgroundColor: colors.white,
    borderColor: colors.dark,
    overflow: "hidden",
  },
  searchButton: {
    backgroundColor: colors.primary,
  },
  searchButtonText: { color: colors.white },
  searchResultsContainer: {
    borderTopColor: colors.dark,
    borderTopWidth: 1,
    marginTop: 20,
    height: 250,
  },
});

export default SearchScreen;
