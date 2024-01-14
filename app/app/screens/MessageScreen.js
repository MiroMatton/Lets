import React from "react";
import { View, StyleSheet, StatusBar, FlatList, Platform } from "react-native";

import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";
import AppTitle from "../components/AppTitle";
import Message from "../components/Message";
import OfflineAlert from "../components/OfflineAlert";
import { useIsFocused } from "@react-navigation/native";
import { getChatRooms, getRoomsInfo } from "../api/Chat";
import AuthContext from "../auth/context";

function MessageScreen({ navigation }) {
  const { user } = React.useContext(AuthContext);
  const [chatRooms, setChatRooms] = React.useState(null);
  const isFocused = useIsFocused();
  function setter(items) {
    setChatRooms(items);
  }

  React.useEffect(() => {
    let mounted = true;
    if (isFocused) {
      (async () => {
        await getChatRooms(user.UID).then(async (items) => {
          if (mounted) {
            let keyNames = Object.keys(items);
            await getRoomsInfo(keyNames, user.UID, setter);
          }
        });
      })();
    }
    return () => (mounted = false);
  }, [isFocused]);
  return (
    <View style={styles.container}>
      <OfflineAlert />
      <View style={styles.top}>
        <View
          style={styles.statusBar}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <AppTitle style={styles.title}>Berichten</AppTitle>
          <Ionicons
            name="search"
            size={24}
            color={colors.black}
            onPress={() => {
              navigation.navigate("ChatSearch");
            }}
          />
        </View>
      </View>
      <View style={styles.main}>
        {chatRooms
          ? chatRooms
              .sort((a, b) => (a.UID > b.UID ? 1 : -1))
              .map((item) => (
                <Message
                  image={item.image}
                  message={item.city}
                  title={item.name}
                  onPress={() => {
                    navigation.navigate("ChatRoom", item);
                  }}
                />
              ))
          : null}
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
  statusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
  },
  main: {
    flex: 10,
    alignItems: "flex-start",
  },
  message: {
    width: "95%",
    flexDirection: "row",
    padding: 10,
    marginVertical: 5,
  },
  profilePhoto: {
    height: 60,
    width: 60,
    borderRadius: 200,
  },
  chatData: {
    paddingHorizontal: 10,
  },
});

export default MessageScreen;
