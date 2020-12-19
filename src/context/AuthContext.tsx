import React, { ReactNode, useCallback, useState } from "react";
import { firebaseAuth } from "src/firebase";

interface AppUser {
  id: string;
  email: string;
  editor: boolean;
}

interface IauthContext {
  user?: AppUser;
  emailPasswordLogin: (email: string, password: string) => Promise<unknown>;
  logout: () => Promise<unknown>;
}

const AuthContext = React.createContext<IauthContext>({
  emailPasswordLogin: () => new Promise((resolve) => resolve(false)),
  logout: () => new Promise((resolve) => resolve(false)),
});

interface Iprops {
  children: ReactNode;
}

export const AuthContextProvider = ({ children }: Iprops) => {
  const [user, setUser] = useState<AppUser>();

  const emailPasswordLogin = useCallback((email: string, password: string) => {
    return firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then((result) => {
        setUser((result.user as unknown) as AppUser);
        return result;
      });
  }, []);

  const logout = useCallback(() => {
    return firebaseAuth.signOut().then(() => setUser(undefined));
  }, []);

  return (
    <AuthContext.Provider value={{ user, emailPasswordLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
