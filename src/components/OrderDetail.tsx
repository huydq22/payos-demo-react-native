import { DataTable, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
const OrderDetail = () => {
  const orders = [{ name: "Mì tôm Hảo Hảo ly", quantity: 1, price: 1000 }];

  const calculateSumPrice = (orders: any[]) => {
    const totalAmount = orders.reduce((acc, order) => {
      return acc + order.quantity * order.price;
    }, 0);
    return totalAmount;
  };
  return (
    <>
      <DataTable
        style={{ borderColor: "grey", borderWidth: 0.2, borderRadius: 5 }}
      >
        <DataTable.Header>
          <DataTable.Title textStyle={styles.headerTable}>Tên</DataTable.Title>
          <DataTable.Title textStyle={styles.headerTable} numeric>
            Giá trị
          </DataTable.Title>
          <DataTable.Title textStyle={styles.headerTable} numeric>
            Số lượng
          </DataTable.Title>
        </DataTable.Header>
        {orders.map((order, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{order.name}</DataTable.Cell>
            <DataTable.Cell numeric>{order.price} vnd</DataTable.Cell>
            <DataTable.Cell numeric>{order.quantity}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
      <Text style={styles.bottomTable}>
        Tổng tiền: {calculateSumPrice(orders)} vnd
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  headerTable: {
    fontWeight: "bold",
    textAlign: "center",
  },
  bottomTable: {
    fontWeight: "bold",
    textAlign: "right",
    padding: 10,
  },
});
export default OrderDetail;
