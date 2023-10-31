import {
  View,
  StyleSheet,
  Alert,
  Image,
  Text,
  Pressable,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { ActivityIndicator, Button, Modal, Portal } from "react-native-paper";
import { getBanksList } from "../api/Api";
import { useEffect, useState, useRef } from "react";
import TransferInfoField from "./TransferInfoField";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import { captureRef } from "react-native-view-shot";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import SocketIOClient from "socket.io-client";
import { SERVER_URL } from "@env";
import { useNavigation } from "@react-navigation/native";
import { TransferInfoType } from "../../types/types";
import Icon from "react-native-vector-icons/FontAwesome5";
const socket = SocketIOClient(SERVER_URL);

const TransferInfo = ({
  accountName,
  accountNumber,
  amount,
  bin,
  description,
  qrCode,
  orderCode,
}: TransferInfoType) => {
  const [bank, setBank] = useState({ logo: undefined, name: undefined });
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const viewShotRef = useRef(null);
  const navigation = useNavigation();
  const getPermissionAndroid = async () => {
    try {
      let granted;
      if (parseInt(Platform.Version.toString()) >= 32) {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
      } else {
        granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
      }
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else {
        return false;
      }
    } catch (err: any) {
      console.warn(err);
    }
  };

  const captureAndSaveImage = async () => {
    try {
      // Kiểm tra phiên bản android
      if (Platform.OS === "android") {
        const granted = await getPermissionAndroid();
        if (!granted) {
          return;
        }
      }
      if (viewShotRef.current) {
        const uri = await captureRef(viewShotRef, {
          fileName: `${accountNumber}_${bin}_${amount}_${orderCode}_Qrcode.png`,
          format: "png",
          quality: 0.8,
        });
        const image = await CameraRoll.save(uri, { type: "photo" });
        if (image) {
          Alert.alert(
            "",
            "Image saved successfully.",
            [{ text: "OK", onPress: () => {} }],
            { cancelable: false }
          );
        }
      }
    } catch (error) {
      console.error("Error while capturing and saving image:", error);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const resBank = await getBanksList();
        if (resBank.code != "00") throw new Error("Call to getBankList failed");
        const bank = resBank.data.filter((item: any) => item.bin == bin)[0];
        setBank((prev) => bank);
        console.log(bank);
      } catch (error: any) {
        Alert.alert(error.message);
      }
    })();
    socket.emit("joinOrderRoom", orderCode);

    socket.on("paymentUpdated", (data) => {
      setStatus(true);
      console.log(data);
      socket.emit("leaveOrderRoom", orderCode);
      // toast.success("Thanh toán thành công!");
      setTimeout(() => {
        navigation.navigate("Result", { orderCode: orderCode });
      }, 3000);

      // Cập nhật trạng thái đơn hàng trên giao diện người dùng
    });

    return () => {
      socket.emit("leaveOrderRoom", orderCode);
    };
  }, []);
  const cancelOrderHanlde = async () => {
    Alert.alert(
      "Hủy thanh toán",
      "Bạn có muốn hủy đơn hàng không?",
      [
        { text: "Hủy bỏ", onPress: () => {} },
        {
          text: "Xác nhận",
          onPress: () =>
            navigation.navigate("Result", { orderCode: orderCode }),
        },
      ],
      { cancelable: false }
    );
  };
  return (
    <View style={styles.container}>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modelText}>
            Sử dụng một Ứng dụng Ngân hàng bất kỳ để quét mã VietQR
          </Text>
          <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.8 }}>
            <View style={styles.qrCode}>
              <QRCode value={qrCode} size={200} backgroundColor="transparent" />
            </View>
          </ViewShot>
          <View style={styles.modalButton}>
            <Button
              icon="download"
              mode="outlined"
              style={styles.modalButtonStyle}
              onPress={captureAndSaveImage}
            >
              Tải về
            </Button>
            <Button
              icon="share"
              mode="outlined"
              style={styles.modalButtonStyle}
              onPress={() => console.log("Pressed")}
            >
              Chia sẻ
            </Button>
          </View>
        </Modal>
      </Portal>
      <View style={styles.header}>
        {bank.logo && (
          <Image source={{ uri: bank.logo }} style={styles.image} />
        )}
        <View style={styles.headerRight}>
          {bank.name && <Text style={styles.bankName}>{bank.name}</Text>}
          <Text>{accountName}</Text>
        </View>
      </View>
      <View style={styles.innerContainer}>
        <TransferInfoField label="Số tài khoản" text={accountNumber} />
        <TransferInfoField label="Số tiền chuyển khoản" text={amount} />
        <TransferInfoField label="Nội dung chuyển khoản" text={description} />
        <Text style={{ textAlign: "center" }}>
          Mở App Ngân hàng bất kỳ để quét mã VietQR hoặc chuyển khoản chính xác
          nội dung bên trên
        </Text>
        <Pressable
          android_ripple={{ color: "#f6f6f6" }}
          style={styles.qrCode}
          onPress={showModal}
        >
          <QRCode value={qrCode} size={200} backgroundColor="transparent" />
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            gap: 10,
            justifyContent: "center",
          }}
        >
          {!status && (
            <>
              <ActivityIndicator
                size="small"
                color="#6F4CC1"
                animating={true}
              />
              <Text>Đang chờ thanh toán</Text>
            </>
          )}
          {status && (
            <>
              <Icon name="check" size={20} color="#A4C936" />
              <Text>Thanh toán thành công</Text>
            </>
          )}
        </View>

        <Text style={{ textAlign: "center" }}>
          Lưu ý: Nhập chính xác nội dung{" "}
          <Text style={{ fontWeight: "bold" }}>{description}</Text> khi chuyển
          khoản!
        </Text>
        <Button
          mode="contained"
          style={styles.button}
          onPress={cancelOrderHanlde}
        >
          Hủy thanh toán
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: "grey",
    borderWidth: 0.2,
    borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    height: 50,
    backgroundColor: "rgba( 130, 147, 240, 255)",
    paddingVertical: 5,
    gap: 5,
  },
  image: {
    flex: 1,
  },
  bankName: {
    fontWeight: "bold",
  },
  headerRight: {
    flex: 3,
  },
  innerContainer: {
    padding: 20,
    gap: 10,
  },
  qrCode: {
    overflow: "hidden",
    width: 220,
    height: 220,
    padding: 10,
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: "#E2D5FB",
  },
  button: {
    width: 150,
    alignSelf: "center",
  },
  modal: {
    backgroundColor: "white",
    margin: 20,
    paddingVertical: 40,
    gap: 20,
    borderRadius: 10,
    paddingHorizontal: 50,
  },
  modelText: {
    color: "grey",
    textAlign: "center",
  },
  modalButton: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButtonStyle: {
    borderWidth: 0.2,
  },
});

export default TransferInfo;
