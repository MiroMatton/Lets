import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";

import AppText from "./AppText";
import colors from "../config/colors";

function Card({ title, info, number, onPress, profilePhoto }) {
  return (
    <TouchableOpacity style={styles.touchable} onPress={onPress}>
      <View style={styles.cards}>
        <View>
          {profilePhoto ? (
            <Image
              style={styles.profilePhoto}
              source={{
                uri: profilePhoto,
              }}
            />
          ) : (
            <Text></Text>
          )}
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
  profilePhoto: {
    borderRadius: 50,
    marginRight: 10,
    height: 50,
    width: 50,
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
  profilePhoto: {
    borderRadius: 50,
    marginRight: 10,
    height: 50,
    width: 50,
  },
});

export default Card;
