import { View, SafeAreaView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import InputField from "../components/InputField";
import { useState, useEffect } from "react";
import { Button } from "react-native-paper";

export default function DemoScreen() {
  const [name, setName] = useState("");
  const [cast, setCast] = useState("");
  const [content, setContent] = useState("");
  
  //Quản lý trạng thái nút bấm và gọi Api
  const [pressed, setPressed] = useState(undefined);

  useEffect(() => {
    if (pressed === undefined) return;
    (async () => {})();
  }, [pressed]);
  
  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.headerText}>
        Tạo mới đơn hàng
      </Text>
      <InputField
        input={name}
        setInput={setName}
        label="Nhập tên sản phẩm"
        headerText="Tên sản phẩm:"
      />
      <InputField
        input={cast}
        setInput={setCast}
        label="Nhập đơn giá"
        headerText="Đơn giá:"
      />
      <InputField
        input={content}
        setInput={setContent}
        label=" Nhập nội dung:"
        headerText="Nội dung thanh toán:"
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
