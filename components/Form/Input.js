import { Text, TextInput, StyleSheet } from "react-native";

const AppInput = ({ error = undefined, onChange, value, ...others }) => {
  return (
    <>
      <TextInput
        style={[
          styles.input,
          {
            marginBottom: error ? 3 : 10,
          },
        ]}
        onChangeText={onChange}
        value={value}
        {...others}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default AppInput;
