export interface WebHookParamsType {
  cancel: "true";
  code: "00";
  id: "efa3d17b09d54065878a2fd5831176fa";
  orderCode: "703084";
  status: "CANCELLED";
}

export interface TransferInfoType {
  accountName: string;
  accountNumber: string;
  amount: number;
  bin: string;
  description: string;
  qrCode: string;
  orderCode: number;
}
