import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DemoScreen from "./screens/OrderScreen";
import * as Linking from "expo-linking";

const Stack = createStackNavigator();
const prefix = Linking.createURL("/");

export default function App() {
  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Demo: "Demo",
      },
    },
  };
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="Demo" component={DemoScreen} />
      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
