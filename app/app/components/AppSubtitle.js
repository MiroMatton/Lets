import React from "react";
import { Text, StyleSheet } from "react-native";

function AppTitle({ children, style }) {
  return <Text style={[styles.title, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontFamily: "nunitoSans-semibold",
    fontWeight: "bold",
    fontWeight: "400",
  },
});

export default AppTitle;
