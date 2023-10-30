import { View, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-paper";

export default function InputField({
  input,
  setInput,
  label,
  headerText,
  error,
  keyboardType,
}: {
  input: string;
  setInput: (input: string) => void;
  label: string;
  headerText: string;
  error: boolean;
  keyboardType?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{headerText}</Text>
      <TextInput
        label={label}
        value={input}
        mode="outlined"
        activeOutlineColor="rgb(93, 95, 239)"
        onChangeText={(input) => setInput(input)}
        error={error}
        keyboardType={keyboardType ? keyboardType : ("default" as any)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  headerText: {
    fontSize: 16,
    color: "#434343",
    paddingBottom: 5,
  },
});
