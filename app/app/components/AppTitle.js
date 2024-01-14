import React from "react";
import { Text, StyleSheet } from "react-native";

function AppTitle({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: "nunitoSans-bold",
    fontWeight: "bold",
  },
});

export default AppTitle;
