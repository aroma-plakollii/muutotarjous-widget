import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "antd";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const handleChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
  };

  return (
    <ul className="language-switch">
      {language === "fi" ? (
        <li
          onClick={() => handleChange("en")}
          className="language-switch__item"
        >
          {" "}
          <a className="muutto-link">English</a>{" "}
        </li>
      ) : (
        <li
          onClick={() => handleChange("fi")}
          className="language-switch__item"
        >
          {" "}
          <a className="muutto-link">Finnish</a>{" "}
        </li>
      )}
    </ul>
  );
};

export default LanguageSwitcher;
