import React from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  FlatList,
  View,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

// Own Dependencies
import Button from "../Button";

function LazyLoadListItems({ data, error, styles, retrieveMore }) {
  return (
    <SafeAreaView style={styles.container}>
      {error && <Text style={styles.error}>{error}</Text>}
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
              <Button
                onPress={() =>
                  navigation.navigate("Post Details", { id: item.id })
                }
                styleObject={{
                  btn: styles.seePostBtn,
                  btnText: styles.seePostBtnText,
                }}
                title="See Post"
              />
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

// const styles = StyleSheet.create({});

export default LazyLoadListItems;
