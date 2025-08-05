import { SERVER_URL, VIETQR_URL } from "@env";
import axios from "axios";

// PayOS API endpoints
export async function createPayment(paymentData: {
  orderCode: number;
  amount: number;
  description: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  returnUrl: string;
  cancelUrl: string;
  signature?: string;
}) {
  try {
    console.log('Using API URL: https://fizennn.click');
    let res = await axios({
      method: "POST",
      url: `https://fizennn.click/v1/payos/create-payment`,
      data: paymentData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('API error:', error, error?.response);
    return error?.response?.data || error?.message || error;
  }
}

export async function getPaymentInfo(orderCode: string) {
  try {
    let res = await axios({
      method: "GET",
      url: `https://fizennn.click/v1/payos/${orderCode}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    console.error('API error:', error, error?.response);
    return error?.response?.data || error?.message || error;
  }
}

// Legacy API functions (giữ lại để tương thích)
export async function createPaymentLink(formValue: {
  description: string;
  productName: string;
  price: number;
  returnUrl: string;
  cancelUrl: string;
}) {
  try {
    console.log('Using API URL: https://fizennn.click')
    let res = await axios({
      method: "POST",
      url: `https://fizennn.click/order/create`,
      data: formValue,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
}

export async function getOrder(orderId: string) {
  try {
    let res = await axios({
      method: "GET",
      url: `https://fizennn.click/order/${orderId}`,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
}

export async function getBanksList() {
  try {
    let res = await axios({
      method: "GET",
      url: VIETQR_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    return error.response.data;
  }
}
