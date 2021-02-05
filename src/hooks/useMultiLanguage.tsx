import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ENGLISH } from "src/i18n/languages";
import { MultiLanguage } from "src/model/common";

const useMultiLanguage = () => {
  const { i18n, t } = useTranslation("phrases");

  const derive = useCallback(
    (value?: MultiLanguage): string => {
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

  const deriveImage = useCallback(
    (value: MultiLanguage): string => {
      if (value == null) return value;
      // console.log({value})
      return value[i18n.language] || value[ENGLISH];
    },
    [i18n]
  );

  const deriveVideo = useCallback(
    (value: MultiLanguage): string => {
      if (value == null) return value;
      // console.log({value})
      return value[i18n.language] || value[ENGLISH];
    },
    [i18n]
  );

  return { derive, deriveImage, deriveVideo, localize, i18n };
};

export default useMultiLanguage;
