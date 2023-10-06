import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DemoScreen from "./screens/OrderScreen";
import ResultScreen from "./screens/ResultScreen";
import * as Linking from "expo-linking";

const Stack = createStackNavigator();
export default function App() {
  const linking = {
    prefixes: ["testapp2://"],
    config: {
      screens: {
        Demo: "Demo",
        Result: "Result",
        NotFound: '*',
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
        initialRouteName="Demo"
      >
        <Stack.Screen name="Demo" component={DemoScreen} />
        <Stack.Screen name="Result" component={ResultScreen} options={{headerShown: true}} />

      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
