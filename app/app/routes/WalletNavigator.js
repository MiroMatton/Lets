import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WalletScreen from "../screens/WalletScreen";
import TransferScreen from "../screens/TransferScreen";

const Stack = createNativeStackNavigator();

function WalletNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Transfer" component={TransferScreen} />
    </Stack.Navigator>
  );
}

export default WalletNavigator;
