import React from "react";
import { TextInput, StyleSheet } from "react-native";

function AppTextInput({ colors, ...otherProps }) {
  return (
    <TextInput
      placeholderTextColor={colors}
      borderBottomColor={colors}
      color={colors}
      style={styles.input}
      {...otherProps}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1.75,
  },
});

export default AppTextInput;
