import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  StatusBar,
  Platform,
  FlatList,
} from "react-native";
import colors from "../config/colors";
import AppBackButton from "../components/AppBackButton";
import DismissKeyboard from "../components/DismissKeyboard";
import Card from "../components/Card";
import { Ionicons } from "@expo/vector-icons";
import { getSearch, getSearchCategory } from "../api/Api";
import SearchCategory from "../components/SearchCategory";
import NetInfo from "@react-native-community/netinfo";

function SearchScreen({ navigation }) {
  const [search, onchangeSearch] = React.useState(null);
  const [posts, setPosts] = React.useState(null);
  const [activeCategory, setActiveCategory] = React.useState("");
  const [message, setMessage] = React.useState("Geef een zoek term in");

  const onSearch = () => {
    NetInfo.addEventListener((state) => {
      if (state.isConnected === true) {
        getSearch(search, true).then((items) => {
          if (items.length !== 0) {
            setPosts(items);
          } else if (search) setMessage("Geen resultaten"), setPosts(null);
          else setMessage("Geef een zoek term in"), setPosts(null);
        });
      } else if (state.isConnected === false) {
        getSearch(search, false).then((items) => {
          if (items.length !== 0) {
            setPosts(items);
          } else if (search)
            setMessage("Geen resultaten, ga online"), setPosts(null);
          else setMessage("Geef een zoek term in"), setPosts(null);
        });
      }
    });
  };

  const handleCategory = (category) => {
    setActiveCategory(category);
    NetInfo.addEventListener((state) => {
      if (state.isConnected === true) {
        getSearchCategory(search, category, true).then((items) => {
          if (items.length !== 0) {
            setPosts(items);
          } else if (search) setMessage("Geen resultaten"), setPosts(null);
          else setMessage("Geef een zoek term in"), setPosts(null);
        });
      } else if (state.isConnected === false) {
        getSearchCategory(search, category, false).then((items) => {
          if (items.length !== 0) {
            setPosts(items);
          } else if (search)
            setMessage("Geen resultaten, ga online"), setPosts(null);
          else setMessage("Geef een zoek term in"), setPosts(null);
        });
      }
    });
  };
  return (
    <DismissKeyboard>
      <View
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.top}>
          <View style={styles.search}>
            <AppBackButton color="white" />
            <TextInput
              style={styles.input}
              onChangeText={onchangeSearch}
              value={search}
              placeholder="Zoek op trefwoorder"
              placeholderTextColor={colors.white}
              returnKeyType="search"
              onSubmitEditing={onSearch}
            />
          </View>
          <View style={styles.categories}>
            <SearchCategory
              category="lenen"
              title="lenen"
              activeCategory={activeCategory}
              onChangeCategory={handleCategory}
            />
            <SearchCategory
              category="hulpvraag"
              title="hulpvraag"
              activeCategory={activeCategory}
              onChangeCategory={handleCategory}
            />
            <SearchCategory
              category="ik zoek.."
              title="ik zoek.."
              activeCategory={activeCategory}
              onChangeCategory={handleCategory}
            />
            <SearchCategory
              category="weggeven"
              title="weggeven"
              activeCategory={activeCategory}
              onChangeCategory={handleCategory}
            />
            <SearchCategory
              category="aanbod"
              title="aanbod"
              activeCategory={activeCategory}
              onChangeCategory={handleCategory}
            />
          </View>
        </View>
        <View style={styles.main}>
          {posts ? (
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
          ) : (
            <View>
              <View style={styles.BGcircle}>
                <Ionicons name="search" size={45} color={colors.primary} />
              </View>
              <Text color={colors.gray}>{message}</Text>
            </View>
          )}
        </View>
      </View>
    </DismissKeyboard>
  );
}

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  top: {
    flex: 1,
    backgroundColor: colors.primary,
    color: colors.white,
    width: "100%",
  },
  main: {
    flex: 3,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderBottomColor: colors.white,
    borderBottomWidth: 1.75,
    width: "80%",
    color: colors.white,
  },
  search: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "flex-start",
    marginVertical: 20,
    flex: 3,
  },
  button: {
    flexDirection: "row",
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    marginHorizontal: 3,
    marginVertical: 5,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
    paddingLeft: 5,
  },
  circle: {
    width: 35,
    height: 35,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  BGcircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    marginBottom: 10,
  },
});
