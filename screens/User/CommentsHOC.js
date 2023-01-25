import React from "react";
import { FlatList, Image, Text, View } from "react-native";

// Own Dependencies
import AppInput from "../../components/UI/Input";
import formatDate from "../../helpers/formatDate";
import Loader from "../../components/UI/Loader";
import UserImage from "../../components/UI/UserImage";

function CommentsHOC({
  error,
  comment,
  comments,
  handleAddComment,
  loading,
  setComment,
  styles,
  user,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.commentForm}>
        <UserImage image={user.photoURL} styles={styles.userPhoto} />
        <View style={styles.inputContainer}>
          <AppInput
            autoComplete="off"
            autoCorrect={false}
            multiline={true}
            onChange={setComment}
            placeholder="Add a comment..."
            styleObj={styles.input}
            value={comment}
          />
          <Text onPress={handleAddComment} style={styles.addBtn}>
            Post
          </Text>
        </View>
        {error && <Text style={styles.errorMsg}>{error}</Text>}
      </View>

      <View style={styles.commentsGrid}>
        {loading ? (
          <Loader visible={true} />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              return (
                <View key={item.id} style={styles.listItem}>
                  <View style={styles.listItemBody}>
                    {item.image ? (
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
                    <View style={styles.commentBody}>
                      <Text style={styles.commentBodyText}>
                        <Text style={styles.commentBodyUsername}>
                          {item.username}
                        </Text>{" "}
                        {item.commentBody}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
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
        )}
      </View>
    </View>
  );
}

export default CommentsHOC;
