import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../config/colors";
import AppText from "./AppText";

function ChatMessage({ text, uid, userUID }) {
  const messageStyle = uid === userUID ? styles.sent : styles.received;
  return (
    <View style={[styles.message, messageStyle]}>
      <AppText>{text}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    margin: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 400,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: colors.background,
  },
});

export default ChatMessage;
