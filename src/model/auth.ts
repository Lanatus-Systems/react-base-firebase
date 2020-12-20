export interface Roles {
  admin: boolean;
  editor: boolean;
}

export interface AppUser {
  id: string;
  email: string;
  editor: boolean;
}
