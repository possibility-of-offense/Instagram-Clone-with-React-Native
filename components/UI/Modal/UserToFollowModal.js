import React from "react";
import { Modal, Text, StyleSheet, View, Button } from "react-native";
import colors from "../../../themes/colors";

function UserToFollowModal({ modalActions, following, setHomeFollowing }) {
  const { showModal, setShowModal: hideModal } = modalActions;

  const handleSetHomeFollowing = (id) => {
    setHomeFollowing(id);
    hideModal(false);
  };

  return (
    <View>
      <Modal animationType="slide" visible={showModal} transparent={false}>
        <View style={styles.container}>
          {following.length > 0 &&
            following.map((el) => (
              <Text
                key={el.id}
                onPress={() => handleSetHomeFollowing(el.userId)}
              >
                {el.user.username}
              </Text>
            ))}
          <Button onPress={() => hideModal(false)} title="Close Modal" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopColor: colors.dark,
    borderTopWidth: 2,
    padding: 20,
  },
});

export default UserToFollowModal;
