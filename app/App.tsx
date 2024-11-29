import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomePage from "./pages/HomePage";
import CapturePage from "./pages/CapturePage";
import NewHomePage from "./pages/NewHomePage";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="NewHomePage">
        <Stack.Screen name="NewHomePage" component={NewHomePage} />
        <Stack.Screen name="HomePage" component={HomePage} />
        <Stack.Screen name="CapturePage" component={CapturePage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}