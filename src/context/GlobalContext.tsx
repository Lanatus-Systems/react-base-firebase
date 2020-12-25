import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { getCategories } from "src/api/article";
import { Category } from "src/model/article";

interface IglobalContext {
  categories: Category[];
  categoryMap: Record<string, Category>;
}

const GlobalContext = React.createContext<IglobalContext>({
  categories: [],
  categoryMap: {},
});

interface Iprops {
  children: ReactNode;
}

export const GlobalContextProvider = ({ children }: Iprops) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
  }, [categories]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <GlobalContext.Provider value={{ categories, categoryMap }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
