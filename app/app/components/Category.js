import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../config/colors";
import AppText from "../components/AppText";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../styles/GlobalStyle";

function Category({ margin, title, icon, color, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View marginLeft={margin} style={styles.category} backgroundColor={color}>
        <Ionicons name={icon} size={24} color={colors.white} />
        <AppText style={Colors.white}>{title}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  category: {
    height: 55,
    width: 100,
    marginRight: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Category;
