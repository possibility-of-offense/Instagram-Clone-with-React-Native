import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { StyleSheet, Text, TextInput, View } from "react-native";

// Own Dependencies
import AppInput from "../components/UI/Input";
import { AuthContext } from "../context/AuthContext";
import { db } from "../firebase/config";
import Button from "../components/UI/Button";

function SearchScreen(props) {
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");

  // useEffect(() => {
  //   const fetching = async () => {
  //     try {
  //       const users = await getDocs(
  //         query(collection(db, "users"), where("userId", "!=", user.uid))
  //       );
  //       console.log(users.docs.length);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetching();
  // }, []);

  const handleSearch = async () => {
    try {
      const searchResults = await getDocs(collection(db, "users"));
      const mappedSearchResults = searchResults.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      }));

      const foundUsers = [];
      console.log(searchTerm);
      mappedSearchResults.forEach((userObj) => {
        if (
          userObj.email.includes(searchTerm) &&
          !userObj.userId.includes(user.uid)
        ) {
          foundUsers.push(userObj);
        }
      });

      console.log(foundUsers);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      // onChange={(e) => setSearchTerm(e.target.value)}
      style={styles.container}
      // value={searchTerm}
    >
      <TextInput
        value={searchTerm}
        style={{ backgroundColor: "orange", height: 50 }}
        onChangeText={(val) => setSearchTerm(val)}
        placeholder="Search for..."
      />
      <Text style={{ color: "red", backgroundColor: "green", height: 30 }}>
        {searchTerm}
      </Text>
      <Button onPress={handleSearch} title="Search" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
});

export default SearchScreen;
