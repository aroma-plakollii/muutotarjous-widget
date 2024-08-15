import React, { useState } from "react";
import "./App.css";
import GlobalContext, {
  Company,
  GlobalState,
  MovingBoxesForm,
  PriceDetails,
  Price,
  BlockedDate,
} from "./store/GlobalContext";
import Main from "./view/Main";
import i18n from "./translations/i18n";

interface IAppProps {
  companySecret: string | null;
}

function App(props: IAppProps) {
  const [state, setState] = useState<GlobalState>({
    step: 1,
    companySecret: props.companySecret ? props.companySecret : "",
    priceDetails: {} as PriceDetails,
    company: {} as Company,
    movingServiceForm: {} as MovingBoxesForm,
    blockedDates: [],
    type: "",
    box_type: "small",
    price: {} as Price,
    coupon_code: "",
  });

  return (
    <GlobalContext.Provider
      value={{
        globalState: state,
        setGlobalState: setState,
      }}
    >
      <Main />
    </GlobalContext.Provider>
  );
}

export default App;
