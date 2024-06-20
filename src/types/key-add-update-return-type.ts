import { Vendor_Key } from '../schemas/woocommerce-integration/tbl_vendor.schema';

export class KeyAddUpdateReturnType {
  keyData: Vendor_Key;
  message: string;

  constructor(keyData: Vendor_Key, message: string) {
    this.keyData = keyData;
    this.message = message;
  }
}
