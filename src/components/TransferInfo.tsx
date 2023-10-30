import {
  View,
  StyleSheet,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { Button, Modal, Portal } from "react-native-paper";
import { getBanksList } from "../api/Api";
import { useEffect, useState, useRef } from "react";
import TransferInfoField from "./TransferInfoField";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import { captureRef } from "react-native-view-shot";
// import CameraRoll from '@react-native-community/cameraroll';

const TransferInfo = ({
  accountName,
  accountNumber,
  amount,
  bin,
  description,
  qrCode,
}: any) => {
  const [bank, setBank] = useState({ logo: undefined, name: undefined });
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const viewShotRef = useRef(null);

  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Cấp quyền truy cập kho lưu trữ',
          message:
            'Ứng dụng cần quyền lưu ảnh vào thiết bị của bạn ',
          buttonNeutral: 'Để sau',
          buttonNegative: 'Từ chối',
          buttonPositive: 'Cho phép',
        },
      );
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
      // Kiểm tra xem viewShotRef có khả dụng không
      if (Platform.OS === "android") {
        const granted = await getPermissionAndroid();
        if (!granted) {
          return;
        }
      }
      if (viewShotRef.current) {
        const uri = await captureRef(viewShotRef, {
          format: "jpg",
          quality: 0.8,
        });
        await saveImageToStorage(uri, "image");
        console.log("URI of the captured image:", uri);
      }
    } catch (error) {
      console.error("Error while capturing and saving image:", error);
    }
  };
  const saveImageToStorage = async (uri: string, fileName: string) => {
   
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
  }, []);
  const qrCodeOnPress = () => {
    showModal();
  };
  const cancelOrderHanlde = async () => {
    
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
        <TouchableOpacity style={styles.qrCode} onPress={qrCodeOnPress}>
          <QRCode value={qrCode} size={200} backgroundColor="transparent" />
        </TouchableOpacity>
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
    borderWidth: 0.5,
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
