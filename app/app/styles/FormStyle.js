import { StyleSheet, Platform, StatusBar } from "react-native";
import colors from "../config/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  top: {
    flex: 2,
    backgroundColor: colors.primary,
    color: colors.white,
    alignItems: "center",
  },
  form: {
    flex: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  back: {
    justifyContent: "flex-start",
  },
  wrapper: {
    width: "90%",
    justifyContent: "flex-start",
  },
  title: {
    color: colors.white,
    fontSize: 30,
    marginVertical: 50,
  },
  row: {
    marginTop: 50,
  },
  buttons: {
    marginTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  or: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    flex: 1,
    height: 1.75,
    backgroundColor: colors.gray,
  },
});
