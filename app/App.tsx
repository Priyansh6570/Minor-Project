import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "./HomePage";
import CapturePage from "./CapturePage";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="CapturePage" component={CapturePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}