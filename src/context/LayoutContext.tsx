import React, { ReactNode, useLayoutEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

interface IlayoutContext {
  isMobile: boolean;
  isHeaderHidden: boolean;
}

const LayoutContext = React.createContext<IlayoutContext>({
  isMobile: false,
  isHeaderHidden: false,
});

interface Iprops {
  children: ReactNode;
}

const getIsMobile = () => window.innerWidth < 700;

export const hiddenHeaderRoutes = ["/checkout"];

export const LayoutContextProvider = ({ children }: Iprops) => {
  const [isMobile, setIsMobile] = useState<boolean>(getIsMobile());

  const location = useLocation();

  const isHeaderHidden = useMemo(
    () =>
      hiddenHeaderRoutes.includes(location.pathname) ||
      (location.pathname != null && location.pathname.startsWith("/admin")),
    [location]
  );

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
    <LayoutContext.Provider value={{ isMobile, isHeaderHidden }}>
      {children}
    </LayoutContext.Provider>
  );
};

export default LayoutContext;
