import React from "react";
import { Text, StyleSheet } from "react-native";

function AppText({ children, numberOfLines, style }) {
  return (
    <Text numberOfLines={numberOfLines} style={[styles.text, style]}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: "nunitoSans-regular",
  },
});

export default AppText;
