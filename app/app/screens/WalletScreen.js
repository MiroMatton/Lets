import React from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  ToastAndroid,
} from "react-native";
import colors from "../config/colors";
import { Ionicons } from "@expo/vector-icons";
import AppSubtitle from "../components/AppSubtitle";
import AppTitle from "../components/AppTitle";
import Card from "../components/Card";
import AppBackButton from "../components/AppBackButton";
import { getWallet, getTransactions } from "../api/Wallet";
import AuthContext from "../auth/context";
import * as Clipboard from "expo-clipboard";
import NetInfo from "@react-native-community/netinfo";
import OfflineAlert from "../components/OfflineAlert";
import { useIsFocused } from "@react-navigation/native";
import { Colors } from "../styles/GlobalStyle";

function WalletScreen({ navigation }) {
  const { user } = React.useContext(AuthContext);
  const [walletInfo, setWalletInfo] = React.useState(null);
  const [transactions, setTransactions] = React.useState(null);
  const isFocused = useIsFocused();
  const copyToClipboard = () => {
    Clipboard.setString(walletInfo.id);
    ToastAndroid.showWithGravity(
      "wallet nummer gekopieerd",
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  };

  React.useEffect(() => {
    if (isFocused) {
      NetInfo.addEventListener((state) => {
        if (state.isConnected === true) {
          (async () => {
            await getWallet(user.UID, true).then((items) => {
              setWalletInfo(items);
              getTransactions(items.id, user.UID, true).then((items) => {
                setTransactions(items);
              });
            });
          })();
        } else if (state.isConnected === false) {
          (async () => {
            await getWallet(user.UID, false).then((items) => {
              setWalletInfo(items);
              getTransactions(items.id, user.UID, false).then((items) => {
                setTransactions(items);
              });
            });
          })();
        }
      });
    }
  }, [isFocused]);
  return (
    <View
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <OfflineAlert />
      <View style={styles.top}>
        <View style={styles.wrapper}>
          <AppBackButton color="white" />
          <AppSubtitle style={styles.title}>Mijn portomonee</AppSubtitle>
          <View style={styles.row}>
            <View>
              <AppSubtitle style={Colors.white}>Saldo</AppSubtitle>
              {walletInfo && (
                <AppSubtitle style={Colors.white}>
                  {walletInfo.credit}
                </AppSubtitle>
              )}
              {!walletInfo && null}
              <AppSubtitle style={Colors.white}>wallet nummer</AppSubtitle>
              {walletInfo && (
                <AppSubtitle style={Colors.white}>
                  {walletInfo.id}
                  <Ionicons
                    name="ios-copy-outline"
                    size={24}
                    color={colors.white}
                    onPress={copyToClipboard}
                  />
                </AppSubtitle>
              )}
              {!walletInfo && null}
            </View>
            <View style={styles.circle}>
              <Ionicons
                name="card"
                size={30}
                color={colors.primary}
                onPress={() => {
                  navigation.navigate("Transfer", { walletInfo });
                }}
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.main}>
        <View style={styles.wrapper}>
          <AppTitle style={styles.tittle}>transactie</AppTitle>
          <FlatList
            data={transactions}
            renderItem={({ item }) => (
              <Card
                category="transaction"
                title={item.UserName}
                number={item.amount + " pl."}
                info={item.description}
              />
            )}
          />
        </View>
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
    flex: 3,
    backgroundColor: colors.primary,
    color: colors.white,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  main: {
    flex: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  back: {
    justifyContent: "flex-start",
  },
  wrapper: {
    width: "90%",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  title: {
    color: colors.white,
    fontSize: 30,
    marginVertical: 30,
  },
});

export default WalletScreen;
