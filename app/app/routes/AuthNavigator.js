import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LogInScreen from "../screens/LogInScreen";
import SingUpScreen from "../screens/SignUpScreen";
import StartScreen from "../screens/StartScreen";

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Start"
        component={StartScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={LogInScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SignUp"
        component={SingUpScreen}
      />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
