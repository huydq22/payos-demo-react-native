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
        style={{ borderColor: "grey", borderWidth: 0.5, borderRadius: 5 }}
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
            <DataTable.Cell>
              <Text style={styles.text}>{order.name}</Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text style={styles.text}>{order.price} vnd </Text>
            </DataTable.Cell>
            <DataTable.Cell numeric>
              <Text style={styles.text}>{order.quantity}</Text>
            </DataTable.Cell>
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
    color: "black",
  },
  bottomTable: {
    fontWeight: "bold",
    textAlign: "right",
    padding: 10,
    color: "black",
  },
  text: {
    color: "grey",
  },
});
export default OrderDetail;
