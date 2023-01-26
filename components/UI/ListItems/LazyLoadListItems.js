import { useNavigation } from "@react-navigation/native";
import React, { useRef } from "react";
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

function LazyLoadListItems({
  anotherUser = null,
  data,
  error,
  loading,
  styles,
  retrieveMore,
}) {
  const navigation = useNavigation();
  const flatListRef = useRef(null);

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
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 10,
          }}
        >
          <Loader visible={true} />
        </View>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) =>
          !anotherUser ? (
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate("Post Details", { id: item.id })
              }
              style={styles.listItem}
            >
              <View style={index === data.length - 1 && { paddingBottom: 100 }}>
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
                  underlayColor={styles.seePostBtnUnderlay}
                />
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate("Search", {
                  screen: "Another Post Details",
                  params: { id: item.id, userId: item.userId },
                })
              }
              style={styles.listItem}
            >
              <View style={index === data.length - 1 && { paddingBottom: 100 }}>
                <Image source={{ uri: item.postImage }} style={styles.image} />
                <Button
                  onPress={() =>
                    navigation.navigate("Search", {
                      screen: "Another Post Details",
                      params: { id: item.id, userId: item.userId },
                    })
                  }
                  styleObject={{
                    btn: styles.seePostBtn,
                    btnText: styles.seePostBtnText,
                  }}
                  title="See Post"
                  underlayColor={styles.seePostBtnUnderlay}
                />
              </View>
            </TouchableWithoutFeedback>
          )
        }
        ItemSeparatorComponent={() => <View />}
        ListHeaderComponent={() => {
          <Text style={styles.headerText}>Items</Text>;
        }}
        onEndReached={() => {
          retrieveMore();
          flatListRef.current?.scrollToEnd();
        }}
        onEndReachedThreshold={0}
      />
    </SafeAreaView>
  );
}

export default LazyLoadListItems;
