import { firestore } from "src/firebase";
import { Roles } from "src/model/auth";

export const getUserRoles = (email: string): Promise<Roles> => {
  return firestore
    .collection("user_roles")
    .doc(email)
    .get()
    .then((val) => {
      return val.data() as Roles;
    });
};
