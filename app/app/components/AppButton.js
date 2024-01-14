import React from "react";
import { TouchableWithoutFeedback, View, StyleSheet } from "react-native";
import AppTitle from "./AppSubtitle";

function AppButton({ title, BGcolor, TextColor, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.button} backgroundColor={BGcolor}>
        <AppTitle style={{ color: TextColor }}>{title}</AppTitle>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 50,
    minWidth: "50%",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginVertical: 10,
    alignSelf: "center",
  },
});

export default AppButton;
