import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "react-native-paper";
import InputField from "../components/InputField";
import { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import { createPaymentLink } from "../api/Api";
import * as Linking from "expo-linking";
import { TransferInfoType } from "../../types/types";
export default function DemoScreen({navigation}: {navigation: any}) {
  const [name, setName] = useState("Mì tôm Hảo Hảo ly");
  const [cast, setCast] = useState("1000");
  const [content, setContent] = useState("Thanh toan don hang");
  const [errorName, setErrorName] = useState(false);
  const [errorCast, setErrorCast] = useState(false);
  const [errorContent, setErrorContent] = useState(false);
  //Uri trả về từ  PayOs và mở nó trong Web View
  //Quản lý trạng thái nút bấm và gọi Api
  const [pressedButton1, setPressedButton1] = useState(undefined);
  const [pressedButton2, setPressedButton2] = useState(undefined);
  useEffect(() => {
    if (pressedButton1 === undefined) return;
    if (!name.length) setErrorName(true);
    if (!cast.length) setErrorCast(true);
    if (!content.length) setErrorContent(true);
    if (!name.length || !cast.length || !content.length) {
      setPressedButton1(undefined);
      return;
    }
    (async () => {
      try {
        let res = await createPaymentLink({
          productName: name,
          price: parseInt(cast),
          description: content,
          returnUrl: `payosdemoreact://Result`,
          cancelUrl: "payosdemoreact://Result",
        });
        if (res.error === undefined)
          throw new Error("Không thể kết nối đến server");
        if (res.error !== 0) throw new Error(res.message);
      
        Linking.canOpenURL(res.data.checkoutUrl).then(supported => {
          if (supported) {
            Linking.openURL(res.data.checkoutUrl);
          } else {
            console.log("Don't know how to open URI: " + res.data.checkoutUrl);
          }
        });

        setPressedButton1(undefined);
      } catch (error: any) {
        Alert.alert(error.message);
        setPressedButton1(undefined);
      }
    })();
  }, [pressedButton1]);

  useEffect(() => {
    if (pressedButton2 === undefined) return;
    if (!name.length) setErrorName(true);
    if (!cast.length) setErrorCast(true);
    if (!content.length) setErrorContent(true);
    if (!name.length || !cast.length || !content.length) {
      setPressedButton2(undefined);
      return;
    }
    (async () => {
      try {
        let res = await createPaymentLink({
          productName: name,
          price: parseInt(cast),
          description: content,
          returnUrl: `payosdemoreact://Result`,
          cancelUrl: "payosdemoreact://Result",
        });
        if (res.error === undefined)
          throw new Error("Không thể kết nối đến server");
        if (res.error !== 0) throw new Error(res.message);

        console.log(res.data);
        
        navigation.navigate("Payment", res.data as TransferInfoType);
        setPressedButton2(undefined);
      } catch (error: any) {
        Alert.alert(error.message);
        setPressedButton2(undefined);
      }
    })();
  }, [pressedButton2]);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Text variant="headlineMedium" style={styles.headerText}>
          Tạo mới đơn hàng
        </Text>
        <InputField
          input={name}
          setInput={setName}
          label="Nhập tên sản phẩm"
          headerText="Tên sản phẩm:"
          error={errorName}
        />
        <InputField
          input={cast}
          setInput={setCast}
          label="Nhập đơn giá"
          headerText="Đơn giá:"
          keyboardType="numeric"
          error={errorCast}
        />
        <InputField
          input={content}
          setInput={setContent}
          label=" Nhập nội dung:"
          headerText="Nội dung thanh toán:"
          error={errorContent}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => setPressedButton1((prevState) => !prevState as any)}
          loading={pressedButton1}
          disabled={pressedButton1}
        >
          Đến trang thanh toán
        </Button>
        <Text style={{textAlign:"center"}}>Hoặc</Text>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => setPressedButton2((prevState) => !prevState as any)}
          loading={pressedButton2}
          disabled={pressedButton2}
        >
          Đến giao diện thanh toán tùy chỉnh
        </Button>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  button: {
    marginVertical: 20,
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
  },
});
