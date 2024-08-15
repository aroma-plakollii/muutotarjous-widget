import React, { useContext, useEffect, useState } from "react";
import GlobalContext, {GlobalState} from "../store/GlobalContext";
import moment from "moment";
import { getDayPrice, getPackagePrice, checkCoupon } from "../services/SummaryService";
import Loader from "../components/Loader";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const Summary = () => {
  const { globalState, setGlobalState } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [state, setState] = useState({
    loading: true,
  });

  const [coupon, setCoupon] = useState({
    showCouponForm: false,
    couponCode: '',
    couponError: '',
    discountPrice: 0,
    couponIsValid: false
  });

  useEffect(() => {
    const __init = async () => {
      // setState({ ...state, loading: true });
      const data = {
        start_date: moment(
          globalState.movingServiceForm.dates.startDate
        ).format("YYYY-MM-DD"),
        end_date: moment(globalState.movingServiceForm.dates.endDate).format(
          "YYYY-MM-DD"
        ),
        start_address: globalState.movingServiceForm?.address?.start_address
          ? globalState.movingServiceForm.address.start_address.name
          : "",
        end_address: globalState.movingServiceForm?.address?.end_address
          ? globalState.movingServiceForm.address.end_address.name
          : "",
        start_city: globalState.movingServiceForm?.address?.start_address
          ? globalState.movingServiceForm.address.start_address.city
          : "",
        end_city: globalState.movingServiceForm?.address?.end_address
          ? globalState.movingServiceForm.address.end_address.city
          : "",
        quantity: globalState.movingServiceForm.quantity,
        company_id: globalState.company.id,
        type: globalState.box_type,
      };

      const res =
        globalState.type === "package"
          ? await getPackagePrice(data)
          : await getDayPrice(data);

      setGlobalState({
        ...globalState,
        price: {
          ...globalState.price,
          start_distance_price: res.price.start_distance_price,
          end_distance_price: res.price.end_distance_price,
          rent_price: res.price.rent_price,
          total: res.price.total,
        },
      });

      setState({ ...state, loading: false });
    };

    __init();
  }, []);

  const validateCoupon = async () => {
    const data = {
      coupon_code: coupon.couponCode,
      site: "movingboxes"
    }

    const res = await checkCoupon(data);

    if (res.error) {
      setCoupon({
        ...coupon,
        discountPrice: 0,
        couponError: res.error
      });
    } else {
      const totalPrice = Number(globalState.price.total);
      if (res.is_percentage === 1) {
        const discountPercent = Number(res.price) / 100;
        const discountAmount = totalPrice * discountPercent;
        setCoupon({
          ...coupon,
          discountPrice: totalPrice - discountAmount,
          couponError: '',
          couponIsValid: true,
        });
      } else {
        setCoupon({
          ...coupon,
          discountPrice: totalPrice - Number(res.price),
          couponError: '',
          couponIsValid: true,
        });
      }
    }
  }

  const cancelCoupon = () => {
    setCoupon({
      showCouponForm: false,
      couponCode: '',
      couponError: '',
      discountPrice: 0,
      couponIsValid: false
    })
  }

  const getFormatedDate = (date: Date) => {
    const newDate = moment(date);
    return newDate.format("DD.MM.YYYY");
  };

  if (state.loading) {
    return (
      <>
        <div className="loader-container">
          <Loader color="#74c92c" width={50} />
        </div>
      </>
    );
  }

  return (
    <div className={"muutto-container"}>
      <LanguageSwitcher />
      <div className={"muutto-content"}>
        <h3 className={"muutto-content__title"}>{t("moving.box.size")}</h3>
      </div>

      <ul className={"muutto-package"}>
        <li className={"muutto-package__item"}>
          <span>{t("delivery")}: </span>
          <span className="muutto-lead">
            {getFormatedDate(globalState.movingServiceForm.dates.startDate)}
          </span>
        </li>
        <li className={"muutto-package__item"}>
          <span>{t("return")}: </span>
          <span className="muutto-lead">
            {getFormatedDate(globalState.movingServiceForm.dates.endDate)}
          </span>
        </li>
        {globalState.movingServiceForm?.address?.start_address && (
          <li className={"muutto-package__item"}>
            <span>{t("delivery.address.provided")}: </span>
            <span className="muutto-lead">
              {globalState.movingServiceForm.address
                ? globalState.movingServiceForm.address.start_address.name
                : ""}
            </span>
          </li>
        )}
        {globalState.movingServiceForm?.address?.end_address && (
          <li className={"muutto-package__item"}>
            <span>{t("pickup.address.provided")}: </span>
            <span className="muutto-lead">
              {globalState.movingServiceForm.address
                ? globalState.movingServiceForm.address.end_address.name
                : ""}
            </span>
          </li>
        )}
        {!globalState.movingServiceForm?.address?.start_address && (
          <li className={"muutto-package__item"}>
            <span style={{ maxWidth: "200px", alignSelf: "self-start" }}>
              {t("rental.start.date")}:{" "}
            </span>
            <span className="muutto-lead">
              {t("Avoinna Ma-Pe")} {t("klo")} 7.30 – 17.00 ({t("heinäkuussa")}{" "}
              {t("klo")} 7.30–16.00){" "}
              {getFormatedDate(globalState.movingServiceForm.dates.startDate)}
              <br />
              <p>Hämeentie 155, Helsinki</p>
            </span>
          </li>
        )}
        {!globalState.movingServiceForm?.address?.end_address && (
          <li className={"muutto-package__item"}>
            <span style={{ maxWidth: "200px", alignSelf: "self-start" }}>
              {t("Vuokrauksen päättymispäivä")}:{" "}
            </span>
            <span className="muutto-lead">
              {t("open.mon.fri")} {t("clock")} 7.30 – 17.00 ({t("july")}{" "}
              {t("clock")} 7.30–16.00){" "}
              {getFormatedDate(globalState.movingServiceForm.dates.endDate)}
              <br />
              <p>Hämeentie 155, Helsinki</p>
            </span>
          </li>
        )}
        <li className={"muutto-package__item"}>
          <span>{t("number.of.moving.boxes")}: </span>
          <span className="muutto-lead">
            {globalState.movingServiceForm.quantity}
          </span>
        </li>

        <li className={"muutto-package__item"}>
          <span>{t("moving.boxes.rental")}: </span>
          <span className="muutto-lead">{globalState.price.rent_price}€</span>
        </li>

        {globalState.price.start_distance_price > 0 && (
          <li className={"muutto-package__item"}>
            <span>{t("delivery.of.moving.boxes")}: </span>
            <span className="muutto-lead">
              {globalState.price.start_distance_price}€
            </span>
          </li>
        )}

        {globalState.price.end_distance_price > 0 && (
          <li className={"muutto-package__item"}>
            <span>{t("collection.of.moving.boxes")}: </span>
            <span className="muutto-lead">
              {globalState.price.end_distance_price}€
            </span>
          </li>
        )}

        {coupon.discountPrice !== 0 ? <li className={"muutto-package__item"}>
          <span>{t("discount.price")}: </span>
          <b><span className={"discount-price"}>{globalState.price.total}&euro;</span>{coupon.discountPrice}&euro;</b>
        </li> : <li className={"muutto-package__item"}>
          <span>{t("amount.to.be.paid")}: </span>
          <span className="muutto-lead">{globalState.price.total}€</span>
        </li>}
      </ul>

      <hr className={'divider'} style={{margin: '35px 0', width: '100%'}}/>

      {!coupon.couponIsValid && <button type="button" className="muutto-link" onClick={() => setCoupon({
        ...coupon,
        showCouponForm: !coupon.showCouponForm
      })}>Käytä kuponki</button>}

      <div className='ms-coupon'>
        {coupon.showCouponForm && !coupon.couponIsValid &&
            <div className='ms-coupon__form'>
              <input type='text' className='ms-input-group__input' onChange={(e: any) => setCoupon({
                ...coupon,
                couponCode: e.target.value
              })}/>
              <button type="button" className="muutto-button" onClick={validateCoupon}>Käyttää</button>
            </div>
        }

        {coupon.couponError && (
            <p style={{ color: "red" }}>{coupon.couponError}</p>
        )}
        {coupon.couponIsValid && (
            <div className='ms-coupon__is-valid'>
              <p>Käytetty kuponki: <span>{coupon.couponCode}</span></p>
              <button className="muutto-button" style={{backgroundColor: "#6c757d"}} onClick={cancelCoupon}><span>x</span> Peruuttaa</button>
            </div>

        )}
      </div>

      <hr className={'divider'} style={{margin: '35px 0', width: '100%'}}/>

      <div className="muutto-step-nav" style={{ marginTop: "40px" }}>
        <a
          href={void 0}
          className="muutto-link"
          onClick={() =>
            setGlobalState({ ...globalState, step: globalState.step - 1 })
          }
        >
          {t("backwards")}
        </a>
        <button
          type="button"
          className="muutto-button"
          onClick={() =>
            setGlobalState({ ...globalState, step: globalState.step + 1, coupon_code: coupon.couponCode})
          }
        >
          {t("forward")}
        </button>
      </div>
    </div>
  );
};

export default Summary;
