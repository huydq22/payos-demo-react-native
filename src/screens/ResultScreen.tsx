import { useRoute } from "@react-navigation/native";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState, useEffect } from "react";
import { getOrder } from "../api/Api";
import OrderTableDemo from "../components/OrderTableDemo";
import PaymentFieldTableDemo from "../components/PaymentFieldsTableDemo";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
export default function ResultScreen() {
  const navigation = useNavigation();
  const [order, setOrder] = useState();
  const route = useRoute();
  useEffect(() => {
    (async () => {
      try {
        let orderCode = (route as any).params.orderCode;
        if (!orderCode) return;
        let res = await getOrder(orderCode);
        if (res.error === undefined) throw new Error("Không thể kết nối đến server");
        if (res.error !== 0) throw new Error(res.message);
        console.log(res);
        setOrder(res.data);
      } catch (error: any) {
        Alert.alert(error.message);
      }
    })();
  }, []);
  return (
    <ScrollView
      bounces={false}
      alwaysBounceVertical={false}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView style={styles.innerContainer}>
        <OrderTableDemo data={order} />
        <PaymentFieldTableDemo data={(order as any)?.webhook_snapshot?.data} />
      </SafeAreaView>
      <Button mode="text" onPress={() => navigation.navigate("Demo")} style={styles.button}> Quay về trang demo</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    alignSelf: "center",
  },
  innerContainer: {
    gap: 20,
  },
  button:{
    width: 200,
    alignSelf: "center",
    margin: 20
  }
});
