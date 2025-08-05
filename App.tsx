import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DemoScreen from "./src/screens/OrderScreen";
import ResultScreen from "./src/screens/ResultScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import ProductScreen from "./src/screens/ProductScreen";
import { TransferInfoType } from "./types/types";
import { TextEncoder, TextDecoder } from 'text-encoding';
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Demo: undefined;
  Result: { orderCode: number };
  Payment: TransferInfoType;
  Product: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export default function App() {
  const linking = {
    prefixes: ["payosdemoreact://", "exp://192.168.1.10:3000", "https://fizennn.click"],
    config: {
      screens: {
        Demo: "Demo",
        Result: "Result",
        Payment: "Payment",
        Product: "Product",
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
        initialRouteName="Product"
      >
        <Stack.Screen name="Demo" component={DemoScreen} />
        <Stack.Screen name="Result" component={ResultScreen}/>
        <Stack.Screen name="Payment" component={PaymentScreen}/>
        <Stack.Screen name="Product" component={ProductScreen} />
      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
