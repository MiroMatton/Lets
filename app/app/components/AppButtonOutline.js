import React from "react";
import { TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import AppTitle from "./AppSubtitle";

function AppButtonOutline({ title, BGcolor, TextColor, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={styles.button}
        backgroundColor={BGcolor}
        borderColor={TextColor}
      >
        <AppTitle style={{ color: TextColor }}>{title}</AppTitle>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    width: "50%",
    alignItems: "center",
    padding: 5,
    marginVertical: 10,
    alignSelf: "center",
    borderWidth: 2,
  },
});

export default AppButtonOutline;
