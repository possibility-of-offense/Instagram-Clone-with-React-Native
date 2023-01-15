import { Text, TextInput, StyleSheet } from "react-native";

const AppInput = ({
  error = undefined,
  onBlur,
  onChange,
  value,
  visible,
  ...others
}) => {
  return (
    <>
      <TextInput
        style={[
          styles.input,
          {
            marginBottom: error && visible ? 3 : 10,
          },
        ]}
        onBlur={onBlur}
        onChangeText={onChange}
        value={value}
        {...others}
      />
      {error && visible && <Text style={styles.error}>{error}</Text>}
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
