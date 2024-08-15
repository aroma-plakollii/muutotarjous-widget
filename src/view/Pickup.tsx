import React, {useContext, useState} from "react";
import GlobalContext, {BlockedDate} from "../store/GlobalContext";
import ReactDatePicker from "react-datepicker";
import '../../node_modules/react-datepicker/dist/react-datepicker.min.css';
import {GMAPKEY} from "../config";
import {usePlacesWidget} from "react-google-autocomplete";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const Pickup = () => {
    const {globalState, setGlobalState} = useContext(GlobalContext);
    const { t } = useTranslation();
    const [tabs, setTabs] = useState({
        transport: true,
        noTransport: false,
    });
    const [state, setState] = useState({
        date: globalState.movingServiceForm?.dates ? globalState.movingServiceForm.dates.endDate : undefined,
        end_number: globalState.movingServiceForm?.end_number ? globalState.movingServiceForm.end_number : '',
        end_code: globalState.movingServiceForm?.end_code ? globalState.movingServiceForm.end_code : '',
        end_time: '07:30',
        hasError: false
    });
    const [address, setAddress] = useState({
        end_address: globalState.movingServiceForm?.address ? globalState.movingServiceForm.address.end_address?.name : '',
        city: globalState.movingServiceForm?.address ? globalState.movingServiceForm.address.end_address?.city : '',
        placeId: globalState.movingServiceForm?.address ? globalState.movingServiceForm.address.end_address?.placeId : '',
    })

    const onAddressChange = async (place: any) => {
        let city = '';
        place.address_components.forEach((addressComponent: any) => {
            if (addressComponent.types[0] === 'locality') {
                city = addressComponent.long_name;
            }
        })

        setAddress({...address,
            end_address: place.formatted_address,
            city,
            placeId: place.place_id
        });
    };

    const updateGlobalContextDate = (val: any) => {
        setGlobalState({
            ...globalState,
            movingServiceForm: {
                ...globalState.movingServiceForm,
                dates: {
                    ...globalState.movingServiceForm.dates,
                    endDate: val
                }
            }
        });
    };

    const onDateChange = (val: any) => {
        setState({
            ...state,
            date: val
        });
        updateGlobalContextDate(val);
    };

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
                [key]: value
            }
        });
    };

    const onNext = () => {
        if (tabs.transport){
            if (
                !state.date ||
                !address.end_address ||
                !state.end_number
            ){
                setState({
                    ...state,
                    hasError: true
                });

                return;
            }

            setState({...state, end_time: ''});
            setGlobalState({
                ...globalState, movingServiceForm: {
                    ...globalState.movingServiceForm, address: {
                        ...globalState.movingServiceForm.address,
                        end_address: {
                            name: address.end_address,
                            city: address.city,
                            placeId: address.placeId
                        }
                    }
                },
                step: globalState.step + 1
            });

        }

        if (tabs.noTransport){
            if (!state.date || !state.end_time){
                setState({
                    ...state,
                    hasError: true
                });

                return;
            }

            setState({...state, end_number: '', end_code: ''});
            setAddress({...address, end_address: ''});
            setGlobalState({...globalState, step: globalState.step + 1});
        }
    };

    const noTransport = () => {
        setTabs({transport: false, noTransport: true});
        setAddress({...address, end_address: ''});
        setState({...state, end_code: '', end_number: ''});
        setGlobalState({
            ...globalState, movingServiceForm: {
                ...globalState.movingServiceForm,
                end_number: '',
                end_code: '',
                address: {
                    ...globalState.movingServiceForm.address,
                    end_address: null
                }
            }
        })
    }

    const transport = () => {
        setTabs({transport: true, noTransport: false});
    }

    const isWeekDay = (date: Date) => {
        const day = date.getDay();
        return day !== 0 && day !== 6;
    };

    const getDisabledDates = (): Date[] => {
        let blockedDatesList: any = [];

        globalState.blockedDates.map((item: BlockedDate) => {
            let dateObj = new Date(item.date)
            let date = dateObj.getDate();
            let month = dateObj.getMonth();
            let year = dateObj.getFullYear();

            blockedDatesList.push(new Date(year, month, date))
        })

        return blockedDatesList;
    };

    const { ref }: any = usePlacesWidget({
        apiKey: GMAPKEY,
        onPlaceSelected: (place: any) => onAddressChange(place),
        options: {
            types: ["address"],
            componentRestrictions: { country: "fi" },
        }
    })

    return(
        <div className={'muutto-container'}>
            <LanguageSwitcher />
            <div className={'muutto-content'}>
                <h3 className={'muutto-content__title'}>2. {t("return")}</h3>
                <p className={'muutto-content__text'}>{t("self.return.or.pickup")}</p>
            </div>

            <ul className={'muutto-nav'}>
                <li className={`muutto-nav__item ${tabs.transport ? 'active' : ''}`} onClick={() => setTabs({transport: true, noTransport: false})}>
                    <div>{t("delivery.service")} ({t("transport.fee")})</div>
                </li>
                <li className={`muutto-nav__item ${tabs.noTransport ? 'active' : ''}`} onClick={noTransport}>
                    <div>{t("pick.up.myself")} (Hämeentie 155, Helsinki )</div>
                </li>
            </ul>

            <div className={'muutto-form-container'}>
                <div className={'muutto-input-group'}>
                    <label htmlFor="start_d" className="muutto-label">{t("rental.end.date")}:</label>

                    <ReactDatePicker
                        onChange={onDateChange}
                        onSelect={onDateChange}
                        selected={state.date}
                        // value={state.date}
                        filterDate={isWeekDay}
                        minDate={new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)}
                        className={`muutto-input ${state.hasError && !state.date ? 'is-invalid' : ''}`}
                        placeholderText={'dd.mm.yyyy'}
                        dateFormat={'dd.MM.yyyy'}
                        excludeDates={getDisabledDates()}
                        autoComplete={'off'}
                    />
                </div>
                {
                    tabs.noTransport &&
                    <div className={'muutto-input-group'}>
                        <label htmlFor="time" className="muutto-label">{t("start.time")}: {t("open.mon.fri")} {t( "clock")} 7.30 – 17.00 ({t("july")} {t( "clock")} 7.30–16.00)</label>

                        <input className={`muutto-input ${state.hasError && !state.end_time ? 'is-invalid' : ''}`}
                               type="text" id="end_time"
                               placeholder={`${t("open.mon.fri")} ${t("clock")} 7.30 – 17.00 (${t("july")} ${t("clock")} 7.30–16.00)`}
                               defaultValue={'07:30'}
                               value={'07:30'}
                               disabled={true}
                        />
                    </div>
                }

                {
                    tabs.transport &&
                    <div className={'muutto-input-group'}>
                        <label className="muutto-label">{t("pickup.address.specification")}: *</label>

                        <input className={`muutto-input ${state.hasError && !address.end_address ? 'is-invalid' : ''}`}
                               type="text" id="end_address"
                               placeholder="Esimerkikatu 1, Helsinki"
                               ref={ref}
                               defaultValue={address.end_address}
                               onChange={(val: any) => onInputChange('end_address', val)}
                        />
                    </div>
                }

                {
                    tabs.transport &&
                    <div className={'muutto-input-group'}>
                        <label htmlFor="end_number" className="muutto-label">{t("entrence.door.number")}: *</label>
                        <input className={`muutto-input ${state.hasError && !state.end_number ? 'is-invalid' : ''}`}
                               type="text" id="end_number"
                               placeholder="x 130"
                               value={state.end_number}
                               onChange={(val: any) => onInputChange('end_number', val)}
                        />
                    </div>
                }

                {
                    tabs.transport &&
                    <div className={'muutto-input-group'}>
                        <label htmlFor="end_code" className="muutto-label">{t("more.information")} ({t("esim")}: {t("door.code")}):</label>
                        <input
                            className={`muutto-input`}
                            type="text"
                            id="end_code"
                            placeholder={`${t("door.code")}`}
                            value={state.end_code}
                            onChange={(val: any) => onInputChange('end_code', val)}
                        />
                    </div>
                }
            </div>

            <div className="muutto-step-nav">
                <a
                    href={void(0)}
                    className="muutto-link"
                    onClick={() => setGlobalState({...globalState, step: globalState.step - 1})}>{t("backwards")}</a>
                <button type="button" className="muutto-button" onClick={onNext}>{t("forward")}</button>
            </div>
        </div>
    )
}

export default Pickup;