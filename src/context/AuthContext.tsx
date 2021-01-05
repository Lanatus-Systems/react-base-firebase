import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { firebaseAuth } from "src/firebase";
import { AppUser, Roles } from "src/model/auth";
import { getUserRoles } from "src/api/auth";

interface Icredentials {
  email: string;
  password: string;
}
interface IauthContext {
  user?: AppUser;
  roles: Roles;
  emailPasswordLogin: (props: Icredentials) => Promise<unknown>;
  logout: () => Promise<unknown>;
}

const AuthContext = React.createContext<IauthContext>({
  emailPasswordLogin: () => new Promise((resolve) => resolve(false)),
  logout: () => new Promise((resolve) => resolve(false)),
  roles: {} as Roles,
});

interface Iprops {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: Iprops) => {
  const [user, setUser] = useState<AppUser>();
  const [roles, setRoles] = useState<Roles>({} as Roles);

  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => {
      setUser((user as unknown) as AppUser);
    });
  }, []);

  useEffect(() => {
    if (user == null) {
      setRoles({} as Roles);
    } else {
      getUserRoles(user.email).then(setRoles);
    }
  }, [user]);

  const emailPasswordLogin = useCallback(
    ({ email, password }: Icredentials) => {
      return firebaseAuth
        .signInWithEmailAndPassword(email, password)
        .then((result) => {
          setUser((result.user as unknown) as AppUser);
          return result;
        });
    },
    []
  );

  const logout = useCallback(() => {
    return firebaseAuth.signOut().then(() => setUser(undefined));
  }, []);

  return (
    <AuthContext.Provider value={{ user, roles, emailPasswordLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
