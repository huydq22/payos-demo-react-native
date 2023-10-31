import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import * as Clipboard from "expo-clipboard";
import Icon from "react-native-vector-icons/FontAwesome5";
import { useState } from "react";
const TransferInfoField = ({ label, text }: any) => {
  const [pressed, setPressed] = useState(false);
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.text}>{text}</Text>
      </View>
      <Button
        mode="contained"
        onPress={async () => {
          setPressed(true);
          await Clipboard.setStringAsync(text.toString());
          setTimeout(() => setPressed(false), 2000);
        }}
        style={styles.button}
        buttonColor="#E2D5FB"
        textColor="#6F4CC1"
      >
        {pressed ? <Icon name="check" size={15} color="#6F4CC1" /> : <Text style={{fontSize: 12}}>Sao chép</Text>}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "grey",
    borderBottomWidth: 0.2,
    paddingBottom: 10,
    gap: 5,
  },
  innerContainer: {
    flexDirection: "column",
    gap: 2,
    flex: 4
  },
  button: { right: 0, flex: 1, height: 42},
  label: {
    color: "grey",
    fontSize: 12,
  },
  text: {
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default TransferInfoField;
