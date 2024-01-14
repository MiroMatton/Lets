import React from "react";
import Constants from "expo-constants";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import { updateNotificationToken } from "../api/Api";
import AuthContext from "../auth/context";

import Tab from "../routes/Tab";
import PostScreen from "../screens/PostScreen";
import SearchScreen from "../screens/SearchScreen";
import SettingsScreen from "../screens/SettingsScreen";
import WalletNavigator from "./WalletNavigator";
import PostDetailScreen from "../screens/PostDetailScreen";
import ChatRoom from "../screens/ChatRoom";
import ProfileDisplayScreen from "../screens/ProfileDisplayScreen";
import ChatSearchScreen from "../screens/ChatSearchScreen";
import EditEmailScreen from "../screens/EditEmailScreen";
import EditPasswordScreen from "../screens/EditPasswordScreen";
import EditUserinfoScreen from "../screens/EditUserinfoScreen";

const Stack = createNativeStackNavigator();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function HomeNavigator() {
  const { user } = React.useContext(AuthContext);
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();

  React.useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      updateNotificationToken(token, user.UID)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    };
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Tab" component={Tab} />
      <Stack.Screen name="Post" component={PostScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="WalletStack" component={WalletNavigator} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
      <Stack.Screen name="ProfileDetail" component={ProfileDisplayScreen} />
      <Stack.Screen name="ChatSearch" component={ChatSearchScreen} />
      <Stack.Screen name="EditEmail" component={EditEmailScreen} />
      <Stack.Screen name="EditPassword" component={EditPasswordScreen} />
      <Stack.Screen name="EditUserinfo" component={EditUserinfoScreen} />
    </Stack.Navigator>
  );
}

export default HomeNavigator;

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
