import React from "react";
import { Text, View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../config/colors";
import icons from "../config/icons";

function SearchCategory({ activeCategory, onChangeCategory, category, title }) {
  React.useEffect(() => {
    postColor(category);
  }, []);
  const [icon, setIcon] = React.useState(null);
  const [text, setText] = React.useState(colors.black);
  const [colorBG, setColorBG] = React.useState(colors.white);
  const [categoryColor, setCategoryColor] = React.useState(null);

  const [toggle, setToggle] = React.useState(false);
  const postColor = (param) => {
    switch (param) {
      case "hulpvraag":
        return setCategoryColor(colors.red), setIcon(icons.hulpvraag);
      case "lenen":
        return setCategoryColor(colors.primary), setIcon(icons.lenen);
      case "aanbod":
        return setCategoryColor(colors.purple), setIcon(icons.aanbod);
      case "ik zoek..":
        return setCategoryColor(colors.yellow), setIcon(icons.ikZoek);
      case "weggeven":
        return setCategoryColor(colors.green), setIcon(icons.weggeven);
      default:
        return setCategoryColor(colors.green), setIcon(icons.wallet);
    }
  };
  if (
    activeCategory !== category &&
    (text !== colors.black || colorBG !== colors.white)
  ) {
    setText(colors.black);
    setColorBG(colors.white);
  }

  let onPress = () => {
    let t;
    if (toggle) {
      t = false;
      setToggle(false);
    } else if (!toggle) {
      t = true;
      setToggle(true);
    }
    const newTextColor = text === colors.black ? colors.white : colors.black;
    const newColorBG = colorBG === colors.white ? colors.black : colors.white;
    setText(newTextColor);
    setColorBG(newColorBG);
    onChangeCategory(t ? category : null);
  };

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          flexDirection: "row",
          borderRadius: 50,
          paddingVertical: 5,
          paddingHorizontal: 10,
          backgroundColor: colorBG,
          marginHorizontal: 3,
          marginVertical: 5,
          alignItems: "center",
        }}
        color={colorBG}
      >
        <View
          style={{
            width: 35,
            height: 35,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: categoryColor,
          }}
        >
          <Ionicons name={icon} size={24} color={colorBG} />
        </View>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 15,
            textAlign: "center",
            paddingLeft: 5,
            color: text,
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginHorizontal: 3,
    marginVertical: 5,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    paddingLeft: 5,
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  BGcircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    marginBottom: 10,
  },
});
export default SearchCategory;
