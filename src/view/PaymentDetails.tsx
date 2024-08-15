import React, {useContext, useState} from "react";
import GlobalContext from "../store/GlobalContext";
import moment from "moment";
import {storeBooking} from "../services/SummaryService";
import Loader from "../components/Loader";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const PaymentDetails = () => {
    const {globalState, setGlobalState} = useContext(GlobalContext);
    const { t } = useTranslation();
    const [state, setState] = useState({
        first_name: globalState.movingServiceForm.paymentDetails ? globalState.movingServiceForm.paymentDetails.first_name : undefined,
        last_name: globalState.movingServiceForm.paymentDetails ? globalState.movingServiceForm.paymentDetails.last_name : undefined,
        email: globalState.movingServiceForm.paymentDetails ? globalState.movingServiceForm.paymentDetails.email : undefined,
        phone: globalState.movingServiceForm.paymentDetails ? globalState.movingServiceForm.paymentDetails.phone : undefined,
        hasError: false,
        loading: false
    });

    const onInputChange = (key: any, val: any) => {
        const value = val.target ? val.target.value : '';

        setState({
            ...state,
            [key]: value
        });

        updateGlobalContextMovingForm(key, value);
    };

    const updateGlobalContextMovingForm = (key: any, value: any) => {
        setGlobalState({
            ...globalState,
            movingServiceForm: {
                ...globalState.movingServiceForm,
                paymentDetails: {
                    ...globalState.movingServiceForm.paymentDetails,
                    [key]: value
                }
            }
        });
    };

    const onSave = async () => {
        setState({...state, loading: true})
        if (
            !state.first_name ||
            !state.last_name ||
            !state.email ||
            !state.phone
        ){
            setState({
                ...state,
                hasError: true
            });

            return;
        }

        if (!state.hasError){
            let startDate = moment(globalState.movingServiceForm.dates.startDate);
            let endDate = moment(globalState.movingServiceForm.dates.endDate);

            startDate.set({
                hour: Number(globalState.movingServiceForm.start_time),
                minute: 0,
                minutes: 0,
            })

            endDate.set({
                hour: Number(globalState.movingServiceForm.end_time),
                minute: 0,
                minutes: 0,
            })

            const data = {
                start_date: startDate.format('YYYY-MM-DD HH:mm:ss'),
                end_date: endDate.format('YYYY-MM-DD HH:mm:ss'),
                start_address: globalState.movingServiceForm?.address?.start_address ? globalState.movingServiceForm.address.start_address.name : undefined,
                end_address: globalState.movingServiceForm?.address?.end_address ? globalState.movingServiceForm.address.end_address.name : undefined,
                price: globalState.price.total,
                start_price: globalState.price.start_distance_price,
                end_price: globalState.price.end_distance_price,
                rent_price: globalState.price.rent_price,
                quantity: globalState.movingServiceForm.quantity,
                company_id: globalState.company.id,
                type: globalState.box_type,
                start_door_number: globalState.movingServiceForm.start_number,
                end_door_number: globalState.movingServiceForm.end_number,
                start_door_code: globalState.movingServiceForm.start_code,
                end_door_code: globalState.movingServiceForm.end_code,
                start_comment: '',
                end_comment: '',
                first_name: globalState.movingServiceForm.paymentDetails.first_name,
                last_name: globalState.movingServiceForm.paymentDetails.last_name,
                email: globalState.movingServiceForm.paymentDetails.email,
                phone: globalState.movingServiceForm.paymentDetails.phone,
                coupon_code: globalState.coupon_code,
            }

            const res = await storeBooking(data);

            if (res){
                console.log(res)
                setGlobalState({...globalState, step: globalState.step + 1})
                console.log(globalState)
                setState({...state, loading: false})
            }
        }
    };

    if (state.loading) {
        return <>
            <div className="loader-container">
                <Loader color='#74c92c' width={50}/>
            </div>
        </>
    }

    return(
        <div className={'muutto-container'}>
            <LanguageSwitcher />
            <div className={'muutto-content'}>
                <h3 className={'muutto-content__title'}>{t("personal.information")}</h3>
            </div>

            <div className={'muutto-form-container'}>
                <div className={'muutto-input-group'}>
                    <label htmlFor="firstName" className="muutto-label">{t("first.name")}:</label>
                    <input
                        className={`muutto-input ${state.hasError && !state.first_name ? 'is-invalid' : ''}`}
                        type="text" id="firstName"
                        defaultValue={state.first_name}
                        onChange={(val: any) => onInputChange('first_name', val)}
                        placeholder={`${t("first.name")}`}/>
                </div>
                <div className={'muutto-input-group'}>
                    <label htmlFor="lastName" className="muutto-label">{t("last.name")}:</label>
                    <input
                        className={`muutto-input ${state.hasError && !state.last_name ? 'is-invalid' : ''}`}
                        type="text" id="lastName"
                        defaultValue={state.last_name}
                        onChange={(val: any) => onInputChange('last_name', val)}
                        placeholder={`${t("last.name")}`}/>
                </div>
                <div className={'muutto-input-group'}>
                    <label htmlFor="phone" className="muutto-label">{t("telephone.number")}:</label>
                    <input
                        className={`muutto-input ${state.hasError && !state.phone ? 'is-invalid' : ''}`}
                        type="text" id="phone"
                        defaultValue={state.phone}
                        onChange={(val: any) => onInputChange('phone', val)}
                        placeholder={`${t("telephone.number")}`}/>
                </div>
                <div className={'muutto-input-group'}>
                    <label htmlFor="email" className="muutto-label">Email:</label>
                    <input
                        className={`muutto-input ${state.hasError && !state.email ? 'is-invalid' : ''}`}
                        type="email"
                        id="email"
                        defaultValue={state.email}
                        onChange={(val: any) => onInputChange('email', val)}
                        placeholder="Email"/>
                </div>
            </div>
            <div className="muutto-step-nav" style={{marginTop: '40px'}}>
                <a
                    href={void(0)}
                    className="muutto-link"
                    onClick={() => setGlobalState({...globalState, step: globalState.step - 1})}>{t("backwards")}</a>
                <button type="button" className="muutto-button" onClick={onSave}>{t("forward")}</button>
            </div>
        </div>
    )
}

export default PaymentDetails;