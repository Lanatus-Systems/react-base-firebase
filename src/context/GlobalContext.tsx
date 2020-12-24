import React, { ReactNode, useEffect, useState } from "react";
import { getCategories } from "src/api/article";
import { Category } from "src/model/article";

interface IglobalContext {
  categories: Category[];
}

const GlobalContext = React.createContext<IglobalContext>({
  categories: [],
});

interface Iprops {
  children: ReactNode;
}

export const GlobalContextProvider = ({ children }: Iprops) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <GlobalContext.Provider value={{ categories }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
