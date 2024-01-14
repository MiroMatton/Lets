import React from "react";
import { View, StyleSheet, StatusBar, Platform } from "react-native";

import colors from "../config/colors";
import AppTitle from "../components/AppTitle";
import Post from "../components/Post";
import AppBackButton from "../components/AppBackButton";
import OfflineAlert from "../components/OfflineAlert";

function PostsScreen({ route, navigation }) {
  const post = route.params;
  return (
    <View style={styles.container}>
      <OfflineAlert />
      <View style={styles.top}>
        <View
          style={styles.statusBar}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <AppBackButton color="black" />
          <AppTitle style={styles.title}>Bericht</AppTitle>
        </View>
      </View>
      <View style={styles.main}>
        <View style={styles.post}>
          <Post
            userUID={post.UID}
            date={new Date(post.createdAt.seconds * 1000).toLocaleDateString(
              "en-US"
            )}
            image={post.image}
            category={post.category}
            title={post.title}
            number={post.pluimen}
            info={post.description}
            pluimen={post.pluimen}
            onPressMessage={() => {
              navigation.navigate("ChatRoom", post);
            }}
            onPressProfile={() => {
              navigation.pop();
            }}
          />
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
  post: {
    marginTop: 20,
  },
});

export default PostsScreen;
