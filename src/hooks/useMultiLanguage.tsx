import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { MultiLanguage } from "src/model/common";

const useMultiLanguage = () => {
  const { i18n, t } = useTranslation("phrases");

  const derive = useCallback(
    (value: MultiLanguage): string => {
      if (value == null) return "-";
      return value[i18n.language] || "-";
    },
    [i18n]
  );

  const localize = useCallback(
    (value: string): string => {
      return t(value);
    },
    [t]
  );

  return { derive, localize, i18n };
};

export default useMultiLanguage;
