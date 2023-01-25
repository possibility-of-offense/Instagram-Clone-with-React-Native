import React from "react";
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

// Own Dependencies
import Button from "../Button";
import Loader from "../Loader";

function LazyLoadListItems({ data, error, loading, styles, retrieveMore }) {
  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            width: "100%",
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: 10,
          }}
        >
          <Loader visible={true} />
        </View>
      )}
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
              <Image source={{ uri: item.postImage }} style={styles.image} />
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

export default LazyLoadListItems;
