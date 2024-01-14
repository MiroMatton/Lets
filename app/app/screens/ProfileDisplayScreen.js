import React from "react";
import {
  View,
  FlatList,
  ScrollView,
  Platform,
  StatusBar,
  Image,
  StyleSheet,
  ToastAndroid,
} from "react-native";
import { getUserPosts, getUserInfo } from "../api/Api";
import { getWallet } from "../api/Wallet";
import * as Clipboard from "expo-clipboard";

import colors from "../config/colors";
import Card from "../components/Card";
import AppBackButton from "../components/AppBackButton";
import AppTitle from "../components/AppTitle";
import AppText from "../components/AppText";
import NetInfo from "@react-native-community/netinfo";
import OfflineAlert from "../components/OfflineAlert";

function ProfileDisplayScreen({ route, navigation }) {
  const user = route.params;
  const [posts, setPosts] = React.useState(null);
  const [userInfo, setUserInfo] = React.useState(null);
  const [wallet, setWallet] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === true) {
        getUserPosts(user.UID, true).then((items) => {
          setPosts(items);
        });
        getUserInfo(user.UID, true).then((items) => {
          setUserInfo(items);
        });
        getWallet(user.UID, true).then((items) => {
          setWallet(items);
        });
      } else if (state.isConnected === false) {
        getUserPosts(user.UID, false).then((items) => {
          setPosts(items);
        });
        getUserInfo(user.UID, false).then((items) => {
          setUserInfo(items);
        });
        getWallet(user.UID, false).then((items) => {
          setWallet(items);
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const copyToClipboard = () => {
    Clipboard.setString(wallet.id);
    ToastAndroid.showWithGravity(
      "wallet nummer gekopieerd",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  return (
    <View style={styles.container}>
      <OfflineAlert />
      <View style={styles.top}>
        <View
          style={styles.statusBar}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <AppBackButton color="white" />
        </View>
      </View>
      <View style={styles.main}>
        {userInfo ? (
          <View style={styles.userInfo}>
            <Image
              style={styles.profilePhoto}
              source={{
                uri: userInfo.image,
              }}
            />
            <AppTitle style={styles.tittle}>{userInfo.name}</AppTitle>
            <AppText style={{ color: colors.gray }}>{userInfo.city}</AppText>
          </View>
        ) : null}
        <View style={styles.section}>
          {wallet ? (
            <Card
              title="wallet nummer"
              icon="wallet"
              info={wallet.id}
              color={colors.green}
              onPress={copyToClipboard}
            />
          ) : null}
        </View>
        <AppTitle style={styles.tittle}>berichten</AppTitle>
        <ScrollView>
          <View style={[styles.padding, styles.section]}>
            <FlatList
              data={posts}
              keyExtractor={(post) => post.id.toString()}
              renderItem={({ item }) => (
                <Card
                  title={item.title}
                  number={new Date(
                    item.createdAt.seconds * 1000
                  ).toLocaleDateString("de-DE")}
                  category={item.category}
                  info={item.description}
                  onPress={() => {
                    navigation.navigate("PostDetail", item);
                  }}
                />
              )}
            />
          </View>
        </ScrollView>
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
    flex: 2,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    width: "100%",
    alignItems: "flex-start",
  },
  statusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    marginLeft: "5%",
  },
  userInfo: {
    bottom: 100,
    alignSelf: "center",
    alignItems: "center",
  },
  profilePhoto: {
    height: 150,
    width: 150,
    borderRadius: 200,
  },
  main: {
    flex: 8,
    alignItems: "flex-start",
  },
  section: {
    marginHorizontal: "5%",
    textAlign: "left",
  },
  padding: {
    paddingBottom: 50,
  },
  tittle: {
    fontWeight: "bold",
    marginHorizontal: "5%",
    marginTop: 10,
  },
});
export default ProfileDisplayScreen;
