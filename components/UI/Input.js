import React, { useEffect, useRef } from "react";
import { Text, TextInput, StyleSheet } from "react-native";

const AppInput = ({
  error = undefined,
  onBlur,
  onChange,
  styleObj = {},
  toFocus = undefined,
  value,
  visible,
  ...others
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (toFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }

    return () => inputRef.current?.blur();
  }, [toFocus, inputRef]);

  return (
    <>
      <TextInput
        style={[
          styles.input,
          {
            marginBottom: error && visible ? 3 : 10,
          },
          styleObj,
        ]}
        onBlur={onBlur}
        onChangeText={onChange}
        ref={inputRef}
        value={value}
        {...others}
      />
      {error && visible && <Text style={styles.error}>Wrong Input Data</Text>}
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
    // marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default AppInput;
