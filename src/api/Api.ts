import { SERVER_URL, VIETQR_URL } from "@env";
import axios from "axios";
export async function createPaymentLink(formValue: {
  description: string;
  productName: string;
  price: number;
  returnUrl: string;
  cancelUrl: string;
}) {
  try {
    let res = await axios({
      method: "POST",
      url: `${SERVER_URL}/order/create`,
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
      url: `${SERVER_URL}/order/${orderId}`,
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
