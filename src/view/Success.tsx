import {useLocation} from "react-router-dom";
import logo from '../logo.png'
import React, {useEffect, useState} from "react";
import {updatePayment} from "../services/PaymentService";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const ContinueBooking = () => {
    const location = useLocation()
    const { t } = useTranslation();
    const params = new URLSearchParams(location.search);
    const orderNumber = params.get("ORDER_NUMBER");

    const [state, setState] = useState({
        loading: true
    });

    useEffect(() => {
        const __init = async () => {
            const res = await updatePayment(orderNumber)

            if (res){
                setState({loading: false})
                console.log('success')
            }
        }

        __init();
    }, []);


    return (
        <div className="container">
            <LanguageSwitcher />
            <div className="row">
                <div className="col-md-12 text-center">
                    <img src={logo} alt="" className="mt-3" />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 text-center">
                    <div className="card mt-5 d-flex align-items-center justify-content-center">
                        <div style={{
                            borderRadius: '200px',
                            height: '200px',
                            background: "#F8FAF5",
                            margin: "0 auto",
                            width: '200px'
                        }}>
                            <i className="checkmark">✓</i>
                        </div>
                        <h1 className={'success'}>{t("successfully")}</h1>
                        <p className={'success'}>{t("payment.received.confirmation")}.<br/> {t("thank.you.message")}</p>

                        <a className={'mt-5 text-muted'} href="https://muuttotarjous.fi">{t("go.to.home.page")}</a>
                    </div>
                </div>
            </div>

        <div className="loader-wrapper">
            <div className="loader"></div>
        </div>
</div>
)
}

export  default ContinueBooking