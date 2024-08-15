import {useParams} from "react-router-dom";
import logo from '../logo.png'
import ReactDatePicker from "react-datepicker";
import React, {useEffect, useState} from "react";
import moment from "moment";
import {getBlockedDates, getBooking, getContinuePrice, storeAdditionalDays} from "../services/ContinueService";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const ContinueBooking = () => {
    let {id} = useParams();
    const { t } = useTranslation();

    const [state, setState] = useState({
        bookingDetails: {
            id: null,
            end_date: new Date(),
            quantity: null,
            company_id: null
        },
        minDate: new Date(),
        price: 0,
        blockedDates: null
    });

    useEffect(() => {
        const __init = async () => {
            const bookingDetails = await getBooking(id);
            const blockedDates = await getBlockedDates(state.bookingDetails.company_id);

            setState({
                ...state, bookingDetails: {
                    id: bookingDetails.id,
                    end_date: bookingDetails.end_date,
                    quantity: bookingDetails.quantity,
                    company_id: bookingDetails.company_id,
                },
                minDate: bookingDetails.end_date,
                blockedDates
            });
        }

        __init();
    }, []);

    const onDateChange = async (val: any) => {
        let data = {
            id,
            date: moment(val).format('yyyy-MM-DD')
        }

        const continuePrice = await getContinuePrice(data);

        setState({
            ...state,
            bookingDetails: {
                ...state.bookingDetails,
                end_date: new Date(moment(val).format('yyyy-MM-DD'))
            },
            price: continuePrice.price,
        });
        // setState({
        //     ...state,
        //     bookingDetails: {
        //         ...state.bookingDetails,
        //         end_date: val
        //     }
        // });
        //
        // getPrice({id: state.bookingDetails.id, date: moment(val).format('yyyy-MM-DD')});
    };

    const getDisabledDates = (): Date[] => {
        return [
            new Date(moment('2022-12-15').format('yyyy-MM-DD')),
            new Date(moment('2022-12-19').format('yyyy-MM-DD')),
            // new Date(2022, 4, 29)
        ];
    };

    const isWeekDay = (date: Date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    const onSave = async () => {
        let data = {
            booking_id: id,
            date: moment(state.bookingDetails.end_date).format('yyyy-MM-DD hh:mm:ss'),
            price: state.price,
            quantity: state.bookingDetails.quantity
        }

        const res = await storeAdditionalDays(data)

        console.log(res)

    }

    return (
        <div className="container">
            <LanguageSwitcher />
            <div className="row">
                <div className="col-md-12 text-center">
                    <img src={logo} alt="" className="" />
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 text-center">
                    <div className="form-container text-center" style={{maxWidth: '400px', margin: '0 auto'}}>
                        <p className="mt-5">{t("select.rental.end.date")}</p>

                        <ReactDatePicker
                            onChange={onDateChange}
                            onSelect={onDateChange}
                            selected={new Date(state.bookingDetails.end_date)}
                            minDate={new Date(state.minDate)}
                            className={`form-control `}
                            placeholderText={'dd.mm.yyyy'}
                            dateFormat={'dd.M.yyyy'}
                            filterDate={isWeekDay}
                            excludeDates={getDisabledDates()}
                        />

                        <p className="mt-3 mb-4">{t("total.amount")} <b>{state.price} &euro;</b></p>

                        <div className="d-flex justify-content-center">
                            <button type="button" className="btn btn-primary" onClick={onSave}>{t("make.a.payment")}</button>
                        </div>
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