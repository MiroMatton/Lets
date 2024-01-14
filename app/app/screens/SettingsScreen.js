import React, { useState, useContext } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableWithoutFeedback,
  Switch,
  Platform,
  Linking,
} from "react-native";

import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";
import AppTitle from "../components/AppTitle";
import AppSubtitle from "../components/AppSubtitle";
import AppBackButton from "../components/AppBackButton";
import AuthContext from "../auth/context";
import { auth } from "../../Firebase";
import { getUserInfo, updateNotification } from "../api/Api";
import OfflineAlert from "../components/OfflineAlert";
import NetInfo from "@react-native-community/netinfo";
import { Colors } from "../styles/GlobalStyle";

function SettingsScreen({ navigation }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const authContext = useContext(AuthContext);
  const { user } = React.useContext(AuthContext);
  const toggleSwitch = async () => {
    setIsEnabled((previousState) => !previousState);
    await updateNotification(!isEnabled, user.UID);
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        console.log("logging out");
        authContext.setUser(null);
      })
      .catch((error) => alert(error.message));
  };

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === true) {
        getUserInfo(user.UID, true).then((items) => {
          setIsEnabled(items.notifications);
        });
      } else if (state.isConnected === false) {
        getUserInfo(user.UID, false).then((items) => {
          setIsEnabled(items.notifications);
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <OfflineAlert />
      <View style={styles.top}>
        <View
          style={styles.statusBar}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <AppBackButton color="black" />
          <AppTitle style={styles.title}>Settings</AppTitle>
        </View>
      </View>
      <View style={styles.main}>
        <View style={styles.wrapper} alignItems="center">
          <View style={styles.bar}>
            <View style={styles.circle} backgroundColor={colors.red}>
              <Ionicons name="body" size={24} color={colors.white} />
            </View>
            <AppTitle>Account</AppTitle>
          </View>
          <View style={styles.wrapper}>
            <View style={styles.setting}>
              <View style={styles.row}>
                <AppSubtitle style={Colors.gray}>Edit Profile</AppSubtitle>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={colors.gray}
                  onPress={() => {
                    navigation.navigate("EditUserinfo");
                  }}
                />
              </View>
              <View style={styles.line}></View>
            </View>
            <View style={styles.setting}>
              <View style={styles.row}>
                <AppSubtitle style={Colors.gray}>Wijzig Wachtwoord</AppSubtitle>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={colors.gray}
                  onPress={() => {
                    navigation.navigate("EditPassword");
                  }}
                />
              </View>
              <View style={styles.line}></View>
            </View>
            <View style={styles.setting}>
              <View style={styles.row}>
                <AppSubtitle style={Colors.gray}>
                  Wijzig e-mailadres
                </AppSubtitle>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={colors.gray}
                  onPress={() => {
                    navigation.navigate("EditEmail");
                  }}
                />
              </View>
              <View style={styles.line}></View>
            </View>
          </View>
          <View style={styles.bar}>
            <View style={styles.circle} backgroundColor={colors.purple}>
              <Ionicons name="settings" size={24} color={colors.white} />
            </View>
            <AppTitle>Voorkeuren</AppTitle>
          </View>
          <View style={styles.wrapper}>
            <View style={styles.setting}>
              <View style={styles.row}>
                <AppSubtitle style={Colors.gray}>
                  Voorwaarden & Privacy
                </AppSubtitle>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={colors.gray}
                  onPress={() => {
                    Linking.openURL(
                      "https://miromatton.github.io/LETS-privacy/"
                    );
                  }}
                />
              </View>
              <View style={styles.line}></View>
            </View>
            <View style={styles.setting}>
              <View style={styles.row}>
                <AppSubtitle style={Colors.gray}>Notificatie</AppSubtitle>
                <View style={styles.container}>
                  <Switch
                    trackColor={{
                      false: colors.white,
                      true: colors.lightPurple,
                    }}
                    thumbColor={colors.purple}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                  />
                </View>
              </View>
              <View style={styles.line}></View>
            </View>
          </View>
          <TouchableWithoutFeedback onPress={handleSignOut}>
            <View style={styles.button}>
              <AppSubtitle style={Colors.white}>Log out</AppSubtitle>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  top: {
    flex: 1,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    width: "100%",
    alignItems: "center",
  },
  wrapper: {
    width: "90%",
    justifyContent: "flex-start",
  },
  statusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexDirection: "row",
    width: "90%",
  },
  title: {
    fontSize: 20,
    marginLeft: 20,
  },
  main: {
    flex: 10,
    alignItems: "center",
  },
  bar: {
    backgroundColor: colors.white,
    borderRadius: 50,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  line: {
    height: 1.75,
    backgroundColor: colors.gray,
    width: "100%",
  },
  setting: {
    marginVertical: 5,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    width: "50%",
    alignItems: "center",
    padding: 5,
    marginVertical: 10,
  },
});

export default SettingsScreen;
