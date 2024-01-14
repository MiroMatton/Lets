import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

import AppText from "./AppText";
import colors from "../config/colors";

function message({ image, title, message, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.message}>
        <View>
          <Image
            style={styles.profilePhoto}
            source={{
              uri: image,
            }}
          />
        </View>
        <View style={styles.chatData}>
          <AppText>{title}</AppText>
          <AppText style={{ color: colors.gray }}>{message}</AppText>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  message: {
    width: "95%",
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
  },
  profilePhoto: {
    height: 60,
    width: 60,
    borderRadius: 200,
  },
  chatData: {
    paddingHorizontal: 10,
  },
});

export default message;
