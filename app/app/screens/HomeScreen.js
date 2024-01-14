import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  ScrollView,
  FlatList,
  RefreshControl,
} from "react-native";
import colors from "../config/colors";
import AppTitle from "../components/AppTitle";
import Post from "../components/Post";
import { Ionicons } from "@expo/vector-icons";
import Category from "../components/Category";
import OfflineAlert from "../components/OfflineAlert";
import NetInfo from "@react-native-community/netinfo";
import { useIsFocused } from "@react-navigation/native";

import { getFeed } from "../api/Api";

function HomeScreen({ navigation }) {
  const [posts, setPosts] = React.useState(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isConnected, setIsConnected] = React.useState(true);
  const isFocused = useIsFocused();

  React.useEffect(() => {
    if (isFocused) {
      NetInfo.addEventListener((state) => {
        setIsConnected(state.isConnected);
        if (state.isConnected === true) {
          getFeed(true).then((items) => {
            setPosts(items);
          });
        } else if (state.isConnected === false) {
          getFeed(false).then((items) => {
            setPosts(items);
          });
        }
      });
    }
  }, [isFocused]);

  const onRefresh = () => {
    setRefreshing(true);
    console.log(isConnected);
    if (isConnected) {
      getFeed(true).then((items) => {
        setPosts(items);
      });
    } else {
      getFeed(false).then((items) => {
        setPosts(items);
      });
    }
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <OfflineAlert />
      <View style={styles.top}>
        <View
          style={styles.statusBar}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <AppTitle>Home</AppTitle>
          <Ionicons
            name="search"
            size={24}
            color={colors.black}
            onPress={() => {
              navigation.navigate("Search");
            }}
          />
        </View>
      </View>
      <View style={styles.main}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.categories}>
            <AppTitle style={{ marginLeft: "5%" }}>Plaats een bericht</AppTitle>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <Category
                margin={20}
                icon="pricetag"
                title="aanbod"
                color={colors.purple}
                onPress={() => {
                  navigation.navigate("Post", "aanbod");
                }}
              />
              <Category
                icon="sync"
                title="lenen"
                color={colors.primary}
                onPress={() => {
                  navigation.navigate("Post", "lenen");
                }}
              />
              <Category
                icon="body"
                title="hulpvraag"
                color={colors.red}
                onPress={() => {
                  navigation.navigate("Post", "hulpvraag");
                }}
              />
              <Category
                icon="search"
                title="ik zoek.."
                color={colors.yellow}
                onPress={() => {
                  navigation.navigate("Post", "ik zoek..");
                }}
              />
              <Category
                icon="leaf"
                title="weggeven"
                color={colors.green}
                onPress={() => {
                  navigation.navigate("Post", "weggeven");
                }}
              />
            </ScrollView>
          </View>
          <View style={styles.feed}>
            <FlatList
              data={posts}
              renderItem={({ item }) => (
                <Post
                  userUID={item.UID}
                  date={new Date(
                    item.createdAt.seconds * 1000
                  ).toLocaleDateString("de", { timeZone: "UTC" })}
                  category={item.category}
                  title={item.title}
                  number={item.pluimen}
                  info={item.description}
                  image={item.image}
                  pluimen={item.pluimen}
                  onPressMessage={() => {
                    navigation.navigate("ChatRoom", item);
                  }}
                  onPressProfile={() => {
                    navigation.navigate("ProfileDetail", item);
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
  main: {
    flex: 10,
  },
  categories: {
    flex: 1,
    marginVertical: 25,
  },
  feed: {
    flex: 5,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingBottom: 50,
  },
});

export default HomeScreen;
