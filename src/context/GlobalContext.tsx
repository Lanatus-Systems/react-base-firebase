import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { getCategories } from "src/api/article";
import { Category } from "src/model/article";

interface IglobalContext {
  categories: Category[];
  rootCategories: Category[];
  categoryMap: Record<string, Category>;
  subCategoryMap: Record<string, Category[]>;
}

const GlobalContext = React.createContext<IglobalContext>({
  categories: [],
  rootCategories: [],
  categoryMap: {},
  subCategoryMap: {},
});

interface Iprops {
  children: ReactNode;
}

export const GlobalContextProvider = ({ children }: Iprops) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const categoryMap = useMemo(() => {
    return categories.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});
  }, [categories]);

  const rootCategories = useMemo(
    () => categories.filter((item) => !item.parent),
    [categories]
  );

  const subCategoryMap = useMemo(() => {
    return rootCategories.reduce((acc, item) => {
      return {
        ...acc,
        [item.id]: categories.filter((i) => i.parent === item.id),
      };
    }, {});
  }, [rootCategories, categories]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <GlobalContext.Provider
      value={{ categories, categoryMap, subCategoryMap, rootCategories }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
