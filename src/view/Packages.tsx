import React, { useContext, useEffect, useRef, useState } from "react";
import GlobalContext from "../store/GlobalContext";
import { getCompany, getPriceDetails } from "../services/PackageService";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const Packages = () => {
  const { globalState, setGlobalState } = useContext(GlobalContext);
  const { t } = useTranslation();

  const [tabs, setTabs] = useState({
    packet: true,
    custom: false,
  });

  const [state, setState] = useState({
    packageList: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    quantityError: false,
  });

  const quantityInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const __init = async () => {
      const company = await getCompany(globalState.companySecret);
      const priceDetails = await getPriceDetails(company.id);

      setGlobalState({
        ...globalState,
        company: company,
        priceDetails: priceDetails,
      });
    };

    __init();
  }, []);

  const renderPackages = () => {
    return state.packageList.map((item: number) => (
      <li
        className={"muutto-package__item"}
        key={item}
        onClick={() => onPackageSelect(item)}
      >
        {item} kpl
        <span className="muutto-badge" onClick={() => onPackageSelect(item)}>
          {item * Number(globalState.priceDetails.price_per_package)}€ pv
        </span>
      </li>
    ));
  };

  const onPackageSelect = (quantity: any) => {
    setGlobalState({
      ...globalState,
      step: 2,
      type: "package",
      movingServiceForm: {
        ...globalState.movingServiceForm,
        quantity: quantity,
      },
    });
  };

  const onCustomSelect = () => {
    setState({ ...state, quantityError: false });

    let quantity = quantityInput.current?.value
      ? quantityInput.current.value
      : 0;

    if (quantity <= 0) {
      setState({ ...state, quantityError: true });
      return;
    }

    setGlobalState({
      ...globalState,
      step: 2,
      type: "custom",
      movingServiceForm: {
        ...globalState.movingServiceForm,
        quantity: quantity,
      },
    });
  };

  return (
    <div className={"muutto-container"}>
      <LanguageSwitcher />
      <ul className={"muutto-nav"}>
        <li
          className={`muutto-nav__item ${tabs.packet ? "active" : ""}`}
          onClick={() => setTabs({ packet: true, custom: false })}
        >
          <div>{t("affordable.package.offer")}</div>
        </li>
        <li
          className={`muutto-nav__item ${tabs.custom ? "active" : ""}`}
          onClick={() => setTabs({ packet: false, custom: true })}
        >
          <div>{t("customize.package")}</div>
        </li>
      </ul>

      {tabs.packet && (
        <ul className={"muutto-package"}>
          <li className={"muutto-package__item"}>{t("amount")}</li>
          {renderPackages()}
        </ul>
      )}

      {tabs.custom && (
        <div className={"muutto-content"}>
          <h3 className={"muutto-content__title"}>
            {t("customize.package")}
          </h3>
          <p className={"muutto-content__text"}>
            {t("customizable.box.reservations")}
          </p>

          <div className="muutto-input-group custom">
            <input
              className={`muutto-input ${
                state.quantityError ? "is-invalid" : ""
              }`}
              type="text"
              name="boxes"
              placeholder={`${t("number.of.moving.boxes")}`}
              ref={quantityInput}
            />
            <button
              className="muutto-button"
              type="button"
              id="boxes"
              onClick={onCustomSelect}
            >
              {t("reserve")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Packages;
