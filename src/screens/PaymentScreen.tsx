import { ScrollView, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderDetail from "../components/OrderDetail";
import TransferInfo from "../components/TransferInfo";
import { PaperProvider } from "react-native-paper";

const PaymentScreen = ({ navigation, route }: any) => {
  const token = route.params.token;
  console.log(token);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <PaperProvider>
        <SafeAreaView style={styles.container}>
          <Text style={styles.headerText}>Chi tiết đơn hàng</Text>
          <OrderDetail />
          <Text style={styles.headerText}>Thông tin chuyển khoản</Text>
          <TransferInfo
            accountName={token.accountName}
            accountNumber={token.accountNumber}
            amount={token.amount}
            bin={token.bin}
            description={token.description}
            qrCode={token.qrCode}
          />
        </SafeAreaView>
      </PaperProvider>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
export default PaymentScreen;
