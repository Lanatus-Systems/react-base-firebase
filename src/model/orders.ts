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
