export interface UserDetails {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  emailConfirm?: string;
  phone?: string;
}
export interface UserAddress {
  address1: string;
  company?: string;
  address2?: string;
  address3?: string;
  town: string;
  postcode?: string;
  country: string;
}

export interface MagazineInfo {
  id: string;
  term: string;
  type: "digital" | "print";
  price: number;
  startDate: Date;
  voucher?: string;
}

export interface TransactionDetails {
  id: string;
}
export interface OrderRequest {
  id?: string;
  orderDate: Date;
  package: MagazineInfo;
  userDetails: UserDetails;
  userAddress: UserAddress;
  billingDetails?: UserDetails;
  billingAddress?: UserAddress;
  transaction: TransactionDetails;
}

export interface ActiveOrder extends OrderRequest {
  startDate: Date;
  endDate: Date;
}
