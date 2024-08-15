import React, {useContext, useEffect} from "react";
import GlobalContext from "../store/GlobalContext";
import moment from "moment";
import {getDayPrice, getPackagePrice} from "../services/SummaryService";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/LanguageSwitcher";

const Summary = () => {
    const {globalState, setGlobalState} = useContext(GlobalContext);
    const { t } = useTranslation();

    return(
        <div className={'muutto-container'}>
            <LanguageSwitcher />
            <div className={'thank-you'}>
                <div className={'muutto-content'}>
                    <h3 className={'muutto-content__title'}>{t("order.confirmation.reminder")}!</h3>

                    <a
                        href="javascript:void(0)"
                        className="muutto-link"
                        onClick={() => setGlobalState({...globalState, step: 1})}>
                        {t("thank.you")}!
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Summary;