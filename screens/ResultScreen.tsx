import { useRoute } from "@react-navigation/native";
import { StyleSheet, ScrollView, Alert, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import { getOrder } from "../api/Api";
import OrderTableDemo from "../components/OrderTableDemo";
import PaymentFieldTableDemo from "../components/PaymentFieldsTableDemo";
export default function ResultScreen() {
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
    >
      <SafeAreaView style={styles.innerContainer}>
        <OrderTableDemo data={order} />
        <PaymentFieldTableDemo data={(order as any)?.webhook_snapshot?.data} />
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: "95%",
    alignSelf: "center",
  },
  innerContainer: {
    gap: 20,
  },
});
