import { firestore } from "src/firebase";
import { Roles } from "src/model/auth";
import { USER_ROLE } from "./collections";

export const getUserRoles = (email: string): Promise<Roles> => {
  return firestore
    .collection(USER_ROLE)
    .doc(email)
    .get()
    .then((val) => {
      return val.data() as Roles;
    });
};
