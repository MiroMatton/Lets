import React from "react";
import { View, StyleSheet, Modal } from "react-native";
import * as Progress from "react-native-progress";

import colors from "../config/colors";

function LoadingModal({ visible = false }) {
  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        <Progress.Circle
          size={200}
          borderWidth={7}
          indeterminate={true}
          color={colors.white}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
});

export default LoadingModal;
