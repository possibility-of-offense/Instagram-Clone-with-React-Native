import React, { useCallback, useState } from "react";
import { Text, StyleSheet, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

// Own Dependencies
import Loader from "../../components/UI/Loader";
import { getDocs } from "firebase/firestore";

function FollowerScreen({ navigation, route }) {
  const { userId } = route.params;

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setError(false);
      setLoading(false);

      const fetching = async () => {
        setLoading(true);
        try {
          const usersDocs = await getDocs();
          setLoading(false);
        } catch (error) {
          setError(`Couldn't get users!`);
          setLoading(false);
        }
      };

      fetching();
    }, [route])
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Loader visible={true} />
      ) : (
        <View>
          <Text>123</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FollowerScreen;
