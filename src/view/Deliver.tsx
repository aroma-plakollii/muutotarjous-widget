import React, { useContext, useEffect, useState } from "react";
import GlobalContext, { BlockedDate } from "../store/GlobalContext";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GMAPKEY } from "../config";
import { IBlockedDates } from "../models/IBlockedDates";
import { getBlockedDates } from "../services/PickupService";
import { usePlacesWidget } from "react-google-autocomplete";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const Deliver = () => {
  const { globalState, setGlobalState } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [tabs, setTabs] = useState({
    transport: true,
    noTransport: false,
  });
  const [state, setState] = useState({
    date: globalState.movingServiceForm?.dates
      ? globalState.movingServiceForm.dates.startDate
      : undefined,
    start_number: globalState.movingServiceForm?.start_number
      ? globalState.movingServiceForm.start_number
      : "",
    start_code: globalState.movingServiceForm?.start_code
      ? globalState.movingServiceForm.start_code
      : "",
    start_time: "07:30",
    blockedDates: {} as IBlockedDates,
    hasError: false,
    loading: false,
  });

  const [address, setAddress] = useState({
    start_address: globalState.movingServiceForm?.address
      ? globalState.movingServiceForm.address.start_address?.name
      : "",
    city: globalState.movingServiceForm?.address
      ? globalState.movingServiceForm.address.start_address?.city
      : "",
    placeId: globalState.movingServiceForm?.address
      ? globalState.movingServiceForm.address.start_address?.placeId
      : "",
  });

  useEffect(() => {
    const __init = async () => {
      const blockedDates = await getBlockedDates(globalState.company.id);

      console.log(globalState.company.id)

      setGlobalState({
        ...globalState,
        blockedDates: blockedDates,
      });
    };

    __init();
  }, []);

  const onAddressChange = async (place: any) => {
    let city = "";
    place.address_components.forEach((addressComponent: any) => {
      if (addressComponent.types[0] === "locality") {
        city = addressComponent.long_name;
      }
    });

    setAddress({
      ...address,
      start_address: place.formatted_address,
      city,
      placeId: place.place_id,
    });
  };

  const updateGlobalContextAddress = (key: string, value: any) => {
    setGlobalState({
      ...globalState,
      movingServiceForm: {
        ...globalState.movingServiceForm,
        address: {
          ...globalState.movingServiceForm.address,
          [key]: value,
        },
      },
    });
  };

  const updateGlobalContextDate = (val: any) => {
    setGlobalState({
      ...globalState,
      movingServiceForm: {
        ...globalState.movingServiceForm,
        dates: {
          ...globalState.movingServiceForm.dates,
          startDate: val,
        },
      },
    });
  };

  const onDateChange = (val: any) => {
    setState({
      ...state,
      date: val,
    });
    updateGlobalContextDate(val);
  };

  const onInputChange = (key: any, val: any) => {
    const value = val.target ? val.target.value : "";

    setState({
      ...state,
      [key]: value,
    });

    updateGlobalContextMovingForm(key, value);
  };

  const updateGlobalContextMovingForm = (key: any, value: any) => {
    setGlobalState({
      ...globalState,
      movingServiceForm: {
        ...globalState.movingServiceForm,
        [key]: value,
      },
    });
  };

  const onNext = () => {
    setState({ ...state, loading: true });

    if (tabs.transport) {
      if (!state.date || !address.start_address || !state.start_number) {
        setState({
          ...state,
          hasError: true,
        });

        return;
      }

      setState({ ...state, start_time: "" });

      setGlobalState({
        ...globalState,
        movingServiceForm: {
          ...globalState.movingServiceForm,
          address: {
            ...globalState.movingServiceForm.address,
            start_address: {
              name: address.start_address,
              city: address.city,
              placeId: address.placeId,
            },
          },
        },
        step: globalState.step + 1,
      });
    }

    if (tabs.noTransport) {
      if (!state.date || !state.start_time) {
        setState({
          ...state,
          hasError: true,
        });

        return;
      }

      setState({ ...state, start_number: "", start_code: "" });
      setAddress({ ...address, start_address: "" });
      setGlobalState({ ...globalState, step: globalState.step + 1 });
    }
  };

  const noTransport = () => {
    setTabs({ transport: false, noTransport: true });
    setState({ ...state, start_code: "", start_number: "" });
    setAddress({ ...address, start_address: "" });
    setGlobalState({
      ...globalState,
      movingServiceForm: {
        ...globalState.movingServiceForm,
        start_number: "",
        start_code: "",
        address: {
          ...globalState.movingServiceForm.address,
          start_address: null,
        },
      },
    });
  };

  const isWeekDay = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const getDisabledDates = (): Date[] => {
    let blockedDatesList: any = [];

    globalState.blockedDates.map((item: BlockedDate) => {
      let dateObj = new Date(item.date);
      let date = dateObj.getDate();
      let month = dateObj.getMonth();
      let year = dateObj.getFullYear();

      blockedDatesList.push(new Date(year, month, date));
    });

    return blockedDatesList;
  };

  const { ref }: any = usePlacesWidget({
    apiKey: GMAPKEY,
    onPlaceSelected: (place: any) => onAddressChange(place),
    options: {
      types: ["address"],
      componentRestrictions: { country: "fi" },
    },
  });

  return (
    <div className={"muutto-container"}>
      <LanguageSwitcher />
      <div className={"muutto-content"}>
        <h3 className={"muutto-content__title"}>1. {t("pickup")}</h3>
        <p className={"muutto-content__text"}>{t("box.pickup.or.delivery")}.</p>
      </div>

      <ul className={"muutto-nav"}>
        <li
          className={`muutto-nav__item ${tabs.transport ? "active" : ""}`}
          onClick={() => setTabs({ transport: true, noTransport: false })}
        >
          <div>
            {t("delivery.service")} ({t("transport.fee")})
          </div>
        </li>
        <li
          className={`muutto-nav__item ${tabs.noTransport ? "active" : ""}`}
          onClick={noTransport}
        >
          <div>
            {t("pick.up.myself")} ({t("Hämeentie 155, Helsinki")} )
          </div>
        </li>
      </ul>

      <div className={"muutto-form-container"}>
        <div className={"muutto-input-group"}>
          <label htmlFor="start_d" className="muutto-label">
            {t("rental.start.date")}:
          </label>

          <ReactDatePicker
            onChange={onDateChange}
            onSelect={onDateChange}
            selected={state.date}
            // value={state.date}
            filterDate={isWeekDay}
            minDate={new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)}
            className={`muutto-input ${
              state.hasError && !state.date ? "is-invalid" : ""
            }`}
            placeholderText={"dd.mm.yyyy"}
            dateFormat={"dd.MM.yyyy"}
            excludeDates={getDisabledDates()}
            autoComplete={"off"}
          />
        </div>
        {tabs.noTransport && (
          <div className={"muutto-input-group"}>
            <label htmlFor="time" className="muutto-label">
              {t("start.time")}:
            </label>

            <input
              className={`muutto-input ${
                state.hasError && !state.start_time ? "is-invalid" : ""
              }`}
              type="text"
              id="start_time"
              placeholder={`${t("open.mon.fri")} ${t("clock")} 7.30 – 17.00 (${t(
                "july"
              )} ${t("klo")} 7.30–16.00)`}
              defaultValue={"07:30"}
              value={"07:30"}
              disabled={true}
            />
          </div>
        )}

        {tabs.transport && (
          <div className={"muutto-input-group"}>
            <label className="muutto-label">{t("delivery.address.specification")}: *</label>

            <input
              className={`muutto-input ${
                state.hasError && !address.start_address ? "is-invalid" : ""
              }`}
              type="text"
              id="start_address"
              placeholder="Esimerkikatu 1, Helsinki"
              ref={ref}
              defaultValue={address.start_address}
              onChange={(val: any) => onInputChange("start_address", val)}
            />
          </div>
        )}

        {tabs.transport && (
          <div className={"muutto-input-group"}>
            <label htmlFor="start_number" className="muutto-label">
              {t("entrence.door.number")}: *
            </label>
            <input
              className={`muutto-input ${
                state.hasError && !state.start_number ? "is-invalid" : ""
              }`}
              type="text"
              id="start_number"
              placeholder="x 130"
              value={state.start_number}
              onChange={(val: any) => onInputChange("start_number", val)}
            />
          </div>
        )}

        {tabs.transport && (
          <div className={"muutto-input-group"}>
            <label htmlFor="start_code" className="muutto-label">
              {t("more.information")} ({t("esim")}: {t("door.code")}):
            </label>
            <input
              className={`muutto-input`}
              type="text"
              id="start_code"
              placeholder={`${t("door.code")}`}
              value={state.start_code}
              onChange={(val: any) => onInputChange("start_code", val)}
            />
          </div>
        )}
      </div>

      <div className="muutto-step-nav d-flex justify-content-between pt-5">
        <a
          href={void 0}
          className="muutto-link"
          onClick={() =>
            setGlobalState({ ...globalState, step: globalState.step - 1 })
          }
        >
          {t("backwards")}
        </a>
        <button type="button" className="muutto-button" onClick={onNext}>
          {t("forward")}
        </button>
      </div>
    </div>
  );
};

export default Deliver;
