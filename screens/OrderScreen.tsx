import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Linking 
} from "react-native";
import { Text } from "react-native-paper";
import InputField from "../components/InputField";
import { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import { createPaymentLink } from "../api/Api";
import { WebView } from "react-native-webview";
import { makeRedirectUri } from "expo-auth-session";

export default function DemoScreen() {
  const [name, setName] = useState("Mì tôm Hảo Hảo ly");
  const [cast, setCast] = useState("1000");
  const [content, setContent] = useState("Thanh toan don hang");
  const [errorName, setErrorName] = useState(false);
  const [errorCast, setErrorCast] = useState(false);
  const [errorContent, setErrorContent] = useState(false);
  //Uri trả về từ  PayOs và mở nó trong Web View
  //Quản lý trạng thái nút bấm và gọi Api
  const [pressed, setPressed] = useState(undefined);

  useEffect(() => {
    if (pressed === undefined) return;
    if (!name.length) setErrorName(true);
    if (!cast.length) setErrorCast(true);
    if (!content.length) setErrorContent(true);
    if (!name.length || !cast.length || !content.length) {
      setPressed(undefined);
      return;
    }
    (async () => {
      try {
        let res = await createPaymentLink({
          productName: name,
          price: parseInt(cast),
          description: content,
          returnUrl: "testapp://Result",
          cancelUrl: "testapp://Result",
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

        setPressed(undefined);
      } catch (error: any) {
        Alert.alert(error.message);
        setPressed(undefined);
      }
    })();
  }, [pressed]);

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
          onPress={() => setPressed((prevState) => !prevState as any)}
          loading={pressed}
          disabled={pressed}
        >
          Đến trang thanh toán
        </Button>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    marginTop: 20,
    width: "90%",
    alignSelf: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  button: {
    marginTop: 20,
    width: "60%",
    alignSelf: "center",
    borderRadius: 10,
  },
});
