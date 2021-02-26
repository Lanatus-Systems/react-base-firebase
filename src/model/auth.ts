export interface Roles {
  admin: boolean;
  editor: boolean;
}

export interface AppUser {
  uid: string;
  email: string;
  photoURL: string;
  displayName?: string;
}
