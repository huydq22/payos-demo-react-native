import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DemoScreen from "./src/screens/OrderScreen";
import ResultScreen from "./src/screens/ResultScreen";
import PaymentScreen from "./src/screens/PaymentScreen";

const Stack = createStackNavigator();
export default function App() {
  const linking = {
    prefixes: ["payosdemoreact://"],
    config: {
      screens: {
        Demo: "Demo",
        Result: "Result",
        Payment: "Payment",
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
        <Stack.Screen name="Payment" component={PaymentScreen}/>
      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
