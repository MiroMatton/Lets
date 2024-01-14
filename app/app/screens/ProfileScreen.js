import React from "react";
import {
  View,
  StyleSheet,
  Image,
  StatusBar,
  FlatList,
  ScrollView,
  Platform,
} from "react-native";

import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";
import Card from "../components/Card";
import AppText from "../components/AppText";
import AppTitle from "../components/AppTitle";
import AuthContext from "../auth/context";
import NetInfo from "@react-native-community/netinfo";
import OfflineAlert from "../components/OfflineAlert";
import { getUserPosts } from "../api/Api";

function ProfileScreen({ navigation }) {
  const { user } = React.useContext(AuthContext);
  const [posts, setPosts] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === true) {
        getUserPosts(user.UID, true).then((items) => {
          setPosts(items);
        });
      } else if (state.isConnected === false) {
        getUserPosts(user.UID, false).then((items) => {
          setPosts(items);
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
          <Ionicons
            name="ios-settings-sharp"
            size={24}
            color={colors.white}
            onPress={() => {
              navigation.navigate("Settings", posts);
            }}
          />
        </View>
      </View>
      <View style={styles.main}>
        <View style={styles.userInfo}>
          <Image
            style={styles.profilePhoto}
            source={{
              uri: user.image,
            }}
          />
          <AppTitle style={styles.tittle}>{user.name}</AppTitle>
          <AppText style={{ color: colors.gray }}>{user.city}</AppText>
        </View>
        <AppTitle style={styles.tittle}>transactie</AppTitle>
        <View style={styles.section}>
          <Card
            title="wallet"
            icon="wallet"
            color={colors.green}
            onPress={() => {
              navigation.navigate("WalletStack");
            }}
          />
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
                  icon="wallet"
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
    alignItems: "flex-end",
  },
  statusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    marginRight: "5%",
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

export default ProfileScreen;
