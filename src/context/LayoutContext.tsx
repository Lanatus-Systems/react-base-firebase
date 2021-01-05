import React, { ReactNode, useLayoutEffect, useState } from "react";

interface IlayoutContext {
  isMobile: boolean;
}

const LayoutContext = React.createContext<IlayoutContext>({
  isMobile: false,
});

interface Iprops {
  children: ReactNode;
}

const getIsMobile = () => window.innerWidth < 640;

export const LayoutContextProvider = ({ children }: Iprops) => {
  const [isMobile, setIsMobile] = useState<boolean>(getIsMobile());

  useLayoutEffect(() => {
    const refreshLayout = (): void => {
      //   console.log("resize fired ...");
      setIsMobile(getIsMobile());
    };
    window.addEventListener("resize", refreshLayout);
    return (): void => {
      window.removeEventListener("resize", refreshLayout);
    };
  }, []);

  return (
    <LayoutContext.Provider value={{ isMobile }}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
