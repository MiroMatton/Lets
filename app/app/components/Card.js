import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "./AppText";
import colors from "../config/colors";
import icons from "../config/icons";

function Card({ title, info, number, category, onPress }) {
  React.useEffect(() => {
    postColor(category);
  }, []);
  const [icon, setIcon] = React.useState(null);
  const [colorBG, setColorBG] = React.useState(null);
  const postColor = (param) => {
    switch (param) {
      case "hulpvraag":
        return setColorBG(colors.red), setIcon(icons.hulpvraag);
      case "lenen":
        return setColorBG(colors.primary), setIcon(icons.lenen);
      case "aanbod":
        return setColorBG(colors.purple), setIcon(icons.aanbod);
      case "ik zoek..":
        return setColorBG(colors.yellow), setIcon(icons.ikZoek);
      case "weggeven":
        return setColorBG(colors.green), setIcon(icons.weggeven);
      case "transaction":
        if (number.charAt(0) === "-") {
          return setColorBG(colors.red), setIcon(icons.wallet);
        } else if (number.charAt(0) === "+") {
          return setColorBG(colors.green), setIcon(icons.wallet);
        }
      default:
        return setColorBG(colors.green), setIcon(icons.wallet);
    }
  };
  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress}>
      <View style={styles.cards}>
        <View style={styles.circle} backgroundColor={colorBG}>
          <Ionicons name={icon} size={24} color={colors.white} />
        </View>
        <View style={styles.info}>
          <AppText number>{title}</AppText>
          <AppText numberOfLines={1} style={{ color: colors.gray }}>
            {info}
          </AppText>
        </View>
        <View style={styles.number}>
          <AppText style={{ color: colors.gray }}>{number}</AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cards: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    maxWidth: "100%",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    width: "70%",
    paddingHorizontal: 10,
  },
  number: {
    width: "20%",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
});

export default Card;
