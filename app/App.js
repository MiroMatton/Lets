import React, { useState } from "react";
import _ from "lodash";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { NavigationContainer } from "@react-navigation/native";
import { LogBox } from "react-native";

import AuthContext from "./app/auth/context";
import AuthNavigator from "./app/routes/AuthNavigator";
import AppNavigator from "./app/routes/AppNavigator";

export default function App() {
  const _console = _.clone(console);
  console.warn = (message) => {
    if (message.indexOf("Setting a timer") <= -1) {
      _console.warn(message);
    }
  };
  React.useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);
  const [user, setUser] = useState();

  let [fontsLoaded] = useFonts({
    "nunitoSans-regular": require("./app/assets/fonts/NunitoSans-Regular.ttf"),
    "nunitoSans-bold": require("./app/assets/fonts/NunitoSans-Bold.ttf"),
    "nunitoSans-semibold": require("./app/assets/fonts/NunitoSans-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
