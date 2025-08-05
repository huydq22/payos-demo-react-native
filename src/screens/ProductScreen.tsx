import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, TextInput, ScrollView, Linking } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { TransferInfoType } from '../../types/types';
import { useNavigation } from '@react-navigation/native';
import { createPayment } from '../api/Api';

const products = [
  { id: '1', name: 'Sản phẩm A', price: 100000, productId: 'prod_001' },
  { id: '2', name: 'Sản phẩm B', price: 2000, productId: 'prod_002' },
  { id: '3', name: 'Sản phẩm C', price: 300000, productId: 'prod_003' },
];

type ProductScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Product'>;

const ProductScreen = () => {
  const navigation = useNavigation<ProductScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Xử lý deep linking
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      if (url.includes('/result')) {
        // Xử lý khi thanh toán thành công
        navigation.navigate('Result', { orderCode: Math.floor(Math.random() * 1000000) });
      } else if (url.includes('/cancel')) {
        // Xử lý khi hủy thanh toán
        Alert.alert('Thông báo', 'Thanh toán đã được hủy');
      }
    };

    // Lắng nghe deep link
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, [navigation]);

  const handleSelectProduct = (item: typeof products[0]) => {
    setSelectedProduct(item);
    setShowForm(true);
  };

  const handleSubmitPayment = async () => {
    if (!selectedProduct) return;

    // Validate form
    if (!buyerInfo.name || !buyerInfo.email || !buyerInfo.phone || !buyerInfo.address) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      // Gọi API PayOS để tạo thanh toán
      const paymentData = {
        orderCode: Math.floor(Math.random() * 1000000), // Tạo orderCode ngẫu nhiên
        amount: selectedProduct.price,
        description: selectedProduct.name,
        buyerName: buyerInfo.name,
        buyerEmail: buyerInfo.email,
        buyerPhone: buyerInfo.phone,
        buyerAddress: buyerInfo.address,
        items: [
          {
            name: selectedProduct.name,
            quantity: 1,
            price: selectedProduct.price
          }
        ],
        returnUrl: 'https://fizennn.click/result',
        cancelUrl: 'https://fizennn.click/cancel',
      };
      console.log('paymentData:', paymentData);

      const response = await createPayment(paymentData);
      console.log('API response:', response);

      if (response && response.error === 0 && response.data) {
        // Tạo dữ liệu TransferInfoType từ response
        const transferInfo: TransferInfoType = {
          amount: response.data.amount,
          description: response.data.description,
          orderCode: response.data.orderCode,
          accountName: response.data.accountName || '',
          accountNumber: response.data.accountNumber || '',
          bin: response.data.bin || '',
          qrCode: response.data.qrCode || '',
        };
        navigation.navigate('Payment', transferInfo);
      } else {
        Alert.alert('Lỗi', `Không thể tạo thanh toán.\n${JSON.stringify(response)}`);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      Alert.alert('Lỗi', `Có lỗi xảy ra khi tạo thanh toán.\n${JSON.stringify(error, Object.getOwnPropertyNames(error))}`);
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
          Thông tin thanh toán
        </Text>
        
        <Text style={{ fontSize: 18, marginBottom: 8 }}>
          Sản phẩm: {selectedProduct?.name}
        </Text>
        <Text style={{ fontSize: 16, marginBottom: 16 }}>
          Giá: {selectedProduct?.price.toLocaleString()} VND
        </Text>

        <TextInput
          style={{ borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 }}
          placeholder="Họ tên"
          value={buyerInfo.name}
          onChangeText={(text) => setBuyerInfo({...buyerInfo, name: text})}
        />

        <TextInput
          style={{ borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 }}
          placeholder="Email"
          value={buyerInfo.email}
          onChangeText={(text) => setBuyerInfo({...buyerInfo, email: text})}
          keyboardType="email-address"
        />

        <TextInput
          style={{ borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 }}
          placeholder="Số điện thoại"
          value={buyerInfo.phone}
          onChangeText={(text) => setBuyerInfo({...buyerInfo, phone: text})}
          keyboardType="phone-pad"
        />

        <TextInput
          style={{ borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 }}
          placeholder="Địa chỉ"
          value={buyerInfo.address}
          onChangeText={(text) => setBuyerInfo({...buyerInfo, address: text})}
          multiline
        />

        <TouchableOpacity
          style={{ 
            backgroundColor: loading ? '#ccc' : '#007AFF', 
            padding: 16, 
            borderRadius: 8, 
            marginBottom: 12 
          }}
          onPress={handleSubmitPayment}
          disabled={loading}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
            {loading ? 'Đang xử lý...' : 'Thanh toán'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ 
            backgroundColor: '#FF3B30', 
            padding: 16, 
            borderRadius: 8 
          }}
          onPress={() => {
            setShowForm(false);
            setSelectedProduct(null);
            setBuyerInfo({ name: '', email: '', phone: '', address: '' });
          }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontSize: 16 }}>
            Hủy
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Danh sách sản phẩm</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ 
              padding: 16, 
              borderWidth: 1, 
              borderRadius: 8, 
              marginBottom: 12,
              opacity: loading ? 0.6 : 1
            }}
            onPress={() => !loading && handleSelectProduct(item)}
            disabled={loading}
          >
            <Text style={{ fontSize: 18 }}>{item.name}</Text>
            <Text>Giá: {item.price.toLocaleString()} VND</Text>
            {loading && <Text style={{ color: 'blue' }}>Đang xử lý...</Text>}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ProductScreen; 