import React from "react";
import {
  Modal,
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";

// Own Dependencies
import Button from "../Button";
import colors from "../../../themes/colors";
import UserImage from "../UserImage";
import { useNavigation } from "@react-navigation/native";

function UserToFollowModal({ modalActions, following, setHomeFollowing }) {
  const { showModal, setShowModal: hideModal } = modalActions;

  const navigation = useNavigation();

  const handleSetHomeFollowing = (id) => {
    setHomeFollowing(id);
    hideModal(false);
  };

  return (
    <View>
      <Modal animationType="slide" visible={showModal} transparent={false}>
        <View style={styles.container}>
          <FlatList
            data={following}
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
                  <View key={item.followerOfUser.userId} style={styles.user}>
                    <View>
                      <UserImage
                        image={item.followerOfUser.image}
                        styles={styles.image}
                      />
                    </View>
                    <Text style={styles.username}>
                      {item.followerOfUser?.username ||
                        item.followerOfUser?.email}
                    </Text>
                    <Button
                      onPress={() => {
                        handleSetHomeFollowing(item.followerOfUser.userId);
                      }}
                      title="Pick"
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
          <Button
            onPress={() => hideModal(false)}
            title="Close Modal"
            styleObject={{
              btn: styles.closeModal,
              btnText: styles.closeModalText,
            }}
            underlayColor={colors.primaryWithoutOpacity}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  checkBtn: {
    backgroundColor: colors.primary,
    marginLeft: "auto",
  },
  checkBtnText: {
    color: colors.white,
  },
  closeModal: {
    alignSelf: "center",
    backgroundColor: colors.primary,
    width: "70%",
    marginTop: 15,
  },
  closeModalText: {
    color: colors.white,
  },
  container: {
    borderTopColor: colors.dark,
    borderTopWidth: 2,
    padding: 20,
  },
  image: {
    borderRadius: 20,
    height: 40,
    width: 40,
  },
  user: {
    alignItems: "center",
    flexDirection: "row",
  },
  username: {
    marginHorizontal: 15,
  },
});

export default UserToFollowModal;
