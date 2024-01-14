import React from "react";
import {
  SafeAreaView,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Text,
  ScrollView,
} from "react-native";
import colors from "../config/colors";
import AppTitle from "../components/AppTitle";
import ChatMessage from "../components/ChatMessage";
import AuthContext from "../auth/context";
import DismissKeyboard from "../components/DismissKeyboard";
import AppBackButton from "../components/AppBackButton";
import { Ionicons } from "@expo/vector-icons";
import OfflineAlert from "../components/OfflineAlert";
import NetInfo from "@react-native-community/netinfo";
import { Colors } from "../styles/GlobalStyle";

//firebase
import { firebase } from "../../Firebase";
import icons from "../config/icons";
import { checkRoomName } from "../api/Chat";

function ChatRoom({ route }) {
  const correspondent = route.params;
  const { user } = React.useContext(AuthContext);
  const [formValue, setFormValue] = React.useState("");
  const [messages, setMessages] = React.useState("");
  const [noMessages, setNoMessages] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [ref, setRef] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [bottomMessage, setBottomMessage] = React.useState("");
  const [docID, setDocID] = React.useState(null);

  const user1 = user.UID;
  const user2 = correspondent.UID;

  const roomName =
    "chat_" + (user1 < user2 ? user1 + "_" + user2 : user2 + "_" + user1);

  checkRoomName(roomName, user1, user2, getRoom);

  function getRoom(room) {
    setDocID(roomName);
  }

  NetInfo.addEventListener((state) => {
    if (state.isConnected === true) {
      if (loaded && noMessages) {
        setNoMessages(false);
      }
    } else if (state.isConnected === false) {
      if (!loaded && !noMessages) {
        setErrorMessage("uw bent offline ga online om dit gesprek te zien.");
        setNoMessages(true);
      }
    }
  });

  React.useEffect(() => {
    if (docID) {
      const unsubscribe = firebase
        .firestore()
        .collection("chatRooms")
        .doc(docID)
        .collection("messages")
        .orderBy("createdAt")
        .onSnapshot((snapshot) => {
          if (snapshot.size) {
            let postList = [];
            snapshot.forEach((doc) => {
              const postItem = doc.data();
              postItem.id = doc.id;
              postList.push(postItem);
              setMessages(postList);
            });
            if (postList.length !== 0) {
              setLoaded(true);
            }
          } else {
            setLoaded(false);
            setNoMessages(true);
            setErrorMessage("Er zijn geen berichten, zeg iets");
          }
        });
      return () => {
        unsubscribe();
      };
    }
  }, [docID]);

  const sendMessage = async () => {
    if (formValue) {
      await firebase
        .firestore()
        .collection("chatRooms")
        .doc(docID)
        .collection("messages")
        .add({
          text: formValue,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          uid: user.UID,
        });
    }
    scrollToBottom();
    setFormValue("");
  };

  const scrollToBottom = () => {
    if (ref != null) {
      ref.scrollTo({
        x: 0,
        y: bottomMessage,
      });
    }
  };

  return (
    <DismissKeyboard>
      <SafeAreaView style={styles.container}>
        <OfflineAlert />
        <View style={styles.top}>
          <View
            style={styles.statusBar}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <AppBackButton color="white" />
            <AppTitle style={styles.title}>{correspondent.name}</AppTitle>
          </View>
        </View>
        {noMessages ? (
          <View style={styles.main}>
            <View style={styles.error}>
              <Text color={colors.gray}>{errorMessage}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.main}>
            {messages ? (
              <ScrollView
                ref={(ref) => {
                  setRef(ref);
                }}
                onContentSizeChange={() => ref.scrollToEnd({ animated: true })}
              >
                <FlatList
                  style={{ minWidth: "100%" }}
                  data={messages}
                  keyExtractor={(message) => message.id.toString()}
                  renderItem={({ item }) => (
                    <ChatMessage
                      text={item.text}
                      uid={item.uid}
                      userUID={user.UID}
                    />
                  )}
                />
                <View
                  onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    setBottomMessage(layout.y);
                  }}
                ></View>
              </ScrollView>
            ) : null}
          </View>
        )}
        <View style={styles.bottom}>
          <TextInput
            style={styles.input}
            onChangeText={setFormValue}
            value={formValue}
            placeholder="stuur iets.."
            placeholderTextColor={colors.gray}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />
          <TouchableWithoutFeedback onPress={sendMessage}>
            <View style={styles.circle}>
              <Ionicons name={icons.send} size={25} color={colors.white} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  top: {
    flex: 1,
    backgroundColor: colors.primary,
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
    color: colors.white,
  },
  main: {
    flex: 10,
    alignItems: "center",
  },
  bottom: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    backgroundColor: colors.background,
    width: "80%",
    color: colors.gray,
    borderRadius: 50,
    margin: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  error: {
    marginVertical: 300,
  },
});
export default ChatRoom;
