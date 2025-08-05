import { ScrollView, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderDetail from "../components/OrderDetail";
import TransferInfo from "../components/TransferInfo";
import { PaperProvider } from "react-native-paper";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { TransferInfoType } from "../../types/types";
import { useEffect, useState } from "react";
import { getPaymentInfo } from "../api/Api";
import { Alert } from "react-native";
import { RootStackParamList } from "../../App";

type PaymentScreenRouteProp = RouteProp<RootStackParamList, 'Payment'>;

export default function PaymentScreen() {
  const route = useRoute<PaymentScreenRouteProp>();
  const transferInfo = route.params;
  const [paymentStatus, setPaymentStatus] = useState<string>('PENDING');
  const [isChecking, setIsChecking] = useState(false);
  const navigation = useNavigation();

  // Kiểm tra trạng thái thanh toán mỗi 3 giây
  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (paymentStatus === 'PENDING') {
        setIsChecking(true);
        try {
          const response = await getPaymentInfo(transferInfo.orderCode.toString());
          console.log('Payment status check:', response);
          
          if (response && response.data) {
            const status = response.data.status;
            setPaymentStatus(status);
            
            if (status === 'PAID') {
              Alert.alert(
                'Thanh toán thành công!',
                'Cảm ơn bạn đã thanh toán. Đơn hàng của bạn đã được xử lý.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      navigation.navigate('Result', { orderCode: transferInfo.orderCode });
                    }
                  }
                ]
              );
            } else if (status === 'CANCELLED') {
              Alert.alert(
                'Thanh toán đã hủy',
                'Thanh toán đã được hủy. Vui lòng thử lại.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Có thể chuyển về trang sản phẩm
                    }
                  }
                ]
              );
            }
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        } finally {
          setIsChecking(false);
        }
      }
    };

    // Kiểm tra lần đầu
    checkPaymentStatus();

    // Kiểm tra mỗi 3 giây
    const interval = setInterval(checkPaymentStatus, 3000);

    return () => clearInterval(interval);
  }, [paymentStatus, transferInfo.orderCode, navigation]);

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Thông tin thanh toán</Text>
          
          <OrderDetail />
          <TransferInfo 
            accountName={transferInfo.accountName}
            accountNumber={transferInfo.accountNumber}
            amount={transferInfo.amount}
            bin={transferInfo.bin}
            description={transferInfo.description}
            qrCode={transferInfo.qrCode}
            orderCode={transferInfo.orderCode}
          />
          
          {isChecking && (
            <Text style={styles.statusText}>
              Đang kiểm tra trạng thái thanh toán...
            </Text>
          )}
          
          <Text style={styles.statusText}>
            Trạng thái: {paymentStatus === 'PENDING' ? 'Chờ thanh toán' : 
                        paymentStatus === 'PAID' ? 'Đã thanh toán' : 
                        paymentStatus === 'CANCELLED' ? 'Đã hủy' : paymentStatus}
          </Text>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  statusText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: "#e8f5e8",
    borderRadius: 8,
  },
});
