import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TouchableHighlight, StyleSheet, View } from "react-native";
import colors from "../config/colors";

function AppBackButton({ color }) {
  const [buttonColor, setButtonColor] = React.useState(null);
  React.useEffect(() => {
    setButtonColor(postColor(color));
  });
  const navigation = useNavigation();
  return (
    <TouchableHighlight
      onPress={() => navigation.pop()}
      activeOpacity={0.9}
      underlayColor={colors.lightGray}
      style={styles.back}
    >
      <View>
        <Ionicons name="arrow-back" size={30} color={buttonColor} />
      </View>
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  back: {
    justifyContent: "flex-start",
    width: 30,
  },
});

export default AppBackButton;

const postColor = (param) => {
  switch (param) {
    case "white":
      return colors.white;
    case "black":
      return colors.black;
  }
};
