import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
} from "react-native";

import { auth } from "../../Firebase";
import colors from "../config/colors";
import AppSubtitle from "../components/AppSubtitle";
import AuthContext from "../auth/context";
import { getUserInfo } from "../api/Api";
import OfflineAlert from "../components/OfflineAlert";
import NetInfo from "@react-native-community/netinfo";
import LoadingModal from "../components/LoadingModal";

function StartScreen({ navigation }) {
  const authContext = React.useContext(AuthContext);
  const [loadingVisible, setLoadingVisible] = React.useState(false);
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        NetInfo.addEventListener(async (state) => {
          if (state.isConnected === true) {
            setLoadingVisible(true);
            console.log("autologin of : ", user.email);
            const userInfo = await getUserInfo(user.uid, true);
            setLoadingVisible(false);
            authContext.setUser(userInfo);
          } else if (state.isConnected === false) {
            console.log("cant performe autologin if offline");
          }
        });
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <OfflineAlert />
      <LoadingModal visible={loadingVisible} />
      <View style={styles.top}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
      </View>
      <View style={styles.main}>
        <TouchableWithoutFeedback onPress={() => navigation.navigate("Login")}>
          <View style={styles.button}>
            <AppSubtitle style={styles.primary}>Log in</AppSubtitle>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => navigation.navigate("SignUp")}>
          <View style={[styles.button, styles.singUp]}>
            <AppSubtitle style={styles.white}>Sign up</AppSubtitle>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  top: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  main: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 200,
  },
  button: {
    backgroundColor: colors.white,
    borderRadius: 50,
    width: "50%",
    alignItems: "center",
    padding: 5,
    marginVertical: 10,
  },
  singUp: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  primary: {
    color: colors.primary,
  },
  white: {
    color: colors.white,
  },
});

export default StartScreen;
