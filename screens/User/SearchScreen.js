import React, { useCallback, useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Own Dependencies
import AppInput from "../../components/UI/Input";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import Button from "../../components/UI/Button";
import colors from "../../themes/colors";
import Loader from "../../components/UI/Loader";
import { useFocusEffect } from "@react-navigation/native";

function SearchScreen({ navigation, route }) {
  const { user } = useContext(AuthContext);

  const [searchState, setSearchState] = useState({
    error: false,
    foundResults: true,
    loading: false,
    searchTerm: "",
    users: [],
  });

  useFocusEffect(
    useCallback(() => {
      setSearchState((prev) => ({
        error: false,
        foundResults: true,
        loading: false,
        searchTerm: "",
        users: [],
      }));
    }, [route])
  );

  useEffect(() => {
    if (searchState.searchTerm !== "") {
      setSearchState((prev) => ({
        ...prev,
        error: false,
        foundResults: true,
        loading: false,
      }));
    }
  }, [searchState.searchTerm]);

  const handleSearch = async () => {
    if (searchState.searchTerm === "") {
      return setSearchState((prev) => ({
        ...prev,
        error: `Fill the input first!`,
      }));
    }
    setSearchState((prev) => ({ ...prev, loading: true, error: false }));
    try {
      const searchResults = await getDocs(collection(db, "users"));
      const mappedSearchResults = searchResults.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      const foundUsers = [];
      mappedSearchResults.forEach((userObj) => {
        if (
          userObj.email.includes(searchState.searchTerm) &&
          !userObj.userId.includes(user.uid)
        ) {
          foundUsers.push(userObj);
        }
      });

      if (foundUsers.length > 0) {
        setSearchState((prev) => ({
          ...prev,
          users: foundUsers,
          loading: false,
          error: false,
        }));
      } else {
        setSearchState((prev) => ({
          ...prev,
          foundResults: false,
          loading: false,
          error: false,
          users: [],
        }));
      }
    } catch (error) {
      console.log(error);
      setSearchState((prev) => ({
        ...prev,
        loading: false,
        error: `The user is not existing! Try another one!`,
      }));
    }
  };

  return (
    <View style={styles.container}>
      <AppInput
        error={searchState.error}
        onChange={(searchTerm) =>
          setSearchState((prev) => ({ ...prev, searchTerm }))
        }
        placeholder="Search for people..."
        placeholderTextColor={colors.dark}
        styleObj={styles.searchInput}
        value={searchState.searchTerm}
        visible={searchState.error}
      />
      <Button
        onPress={handleSearch}
        title="Search"
        styleObject={{
          btn: styles.searchButton,
          btnText: styles.searchButtonText,
        }}
        underlayColor={colors.primaryWithoutOpacity}
      />
      <View
        style={[
          !searchState.loading &&
          (searchState.users.length > 0 || !searchState.foundResults)
            ? styles.searchResultsContainer
            : { height: 250 },
        ]}
      >
        {searchState.loading ? (
          <Loader visible={true} />
        ) : (
          <>
            {searchState.foundResults ? (
              <FlatList
                data={searchState.users}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <View key={item.id} style={styles.listItem}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Search", {
                            screen: "Another User",
                            params: {
                              id: item.id,
                            },
                          })
                        }
                      >
                        <View style={styles.listItemBody}>
                          {item.image && item.image !== "" ? (
                            <Image
                              source={{ uri: item.image }}
                              style={styles.image}
                            />
                          ) : (
                            <Image
                              style={styles.image}
                              source={require("../../assets/images/person.jpg")}
                            />
                          )}
                          <Text style={styles.listItemUsername}>
                            {item.email || item.username}
                          </Text>
                        </View>
                      </TouchableOpacity>
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
