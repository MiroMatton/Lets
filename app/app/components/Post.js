import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableWithoutFeedback,
  Modal,
  Pressable,
} from "react-native";
import colors from "../config/colors";
import AppText from "../components/AppText";
import AppTitle from "../components/AppTitle";
import { Ionicons } from "@expo/vector-icons";
import { getUserInfo } from "../api/Api";
import NetInfo from "@react-native-community/netinfo";
import { Colors } from "../styles/GlobalStyle";

function Post({
  userUID,
  date,
  title,
  info,
  category,
  onPressMessage,
  onPressProfile,
  image,
  pluimen,
}) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState(null);

  React.useEffect(() => {
    postColor(category);
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === true) {
        getUserInfo(userUID, true).then((items) => {
          setUserInfo(items);
        });
      } else if (state.isConnected === false) {
        getUserInfo(userUID, false).then((items) => {
          setUserInfo(items);
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const [colorBG, setColorBG] = React.useState(null);
  const postColor = (param) => {
    switch (param) {
      case "hulpvraag":
        return setColorBG(colors.red);
      case "lenen":
        return setColorBG(colors.primary);
      case "aanbod":
        return setColorBG(colors.purple);
      case "ik zoek..":
        return setColorBG(colors.yellow);
      case "weggeven":
        return setColorBG(colors.green);
      default:
        return setColorBG(colors.primary);
    }
  };
  return (
    <View style={styles.post}>
      <View style={styles.row}>
        <TouchableWithoutFeedback onPress={onPressProfile}>
          <View>
            {userInfo ? (
              <Image
                style={styles.profilePhoto}
                source={{
                  uri: userInfo.image,
                }}
              />
            ) : (
              <Text></Text>
            )}
          </View>
        </TouchableWithoutFeedback>

        <View>
          {userInfo ? (
            <AppText style={styles.title}>{userInfo.name}</AppText>
          ) : (
            <Text></Text>
          )}
          <View style={styles.row}>
            <AppText style={Colors.gray}>{date}</AppText>
            {userInfo ? (
              <AppText style={[Colors.gray, styles.marginLeft]}>
                {userInfo.city}
              </AppText>
            ) : (
              <Text></Text>
            )}
          </View>
        </View>
      </View>
      <View>
        <AppTitle>{title}</AppTitle>
        <AppText>{info}</AppText>
      </View>
      <TouchableWithoutFeedback onPress={() => setModalVisible(true)}>
        <View style={styles.row}>
          {image ? (
            <Image
              style={styles.image}
              source={{
                uri: image,
              }}
            />
          ) : null}
        </View>
      </TouchableWithoutFeedback>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              {userInfo ? (
                <Image
                  style={styles.imageModal}
                  source={{
                    uri: image,
                  }}
                />
              ) : (
                <Text></Text>
              )}
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Ionicons name="close" size={24} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </Modal>
      <View style={styles.row}>
        <View style={styles.categoryPost} backgroundColor={colorBG}>
          <AppText
            style={{
              color: colors.white,
            }}
          >
            {category}
          </AppText>
        </View>
        <Ionicons
          name="ios-chatbubble-ellipses-outline"
          size={24}
          color={colors.black}
          onPress={onPressMessage}
        />
        {pluimen ? (
          <AppText
            style={{
              marginLeft: 10,
            }}
          >
            {pluimen} pl.
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  post: {
    minWidth: "90%",
    maxWidth: "90%",
    marginHorizontal: "5%",
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
  },
  title: {
    fontWeight: "bold",
  },
  profilePhoto: {
    borderRadius: 50,
    marginRight: 10,
    height: 50,
    width: 50,
  },
  image: {
    height: 300,
    flex: 1,
    width: null,
    marginVertical: 5,
  },
  categoryPost: {
    borderRadius: 30,
    paddingHorizontal: 10,
    marginRight: 10,
    justifyContent: "center",
  },
  marginLeft: {
    marginLeft: 5,
  },
  modalView: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  imageModal: {
    height: 550,
    width: 375,
  },
  button: {
    marginTop: 30,
    borderRadius: 50,
    padding: 20,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonClose: {
    backgroundColor: colors.primary,
  },
});

export default Post;
