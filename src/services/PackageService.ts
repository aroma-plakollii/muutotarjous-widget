import axios from "axios";
import {API} from "../config";
import {HEADERS} from "../config";

export const getPriceDetails = async (id: any) => {
    const res = await axios({
        method: 'get',
        url: `${API}/mb-prices-by-company/${id}`,
        headers: HEADERS
    });

    return res.data[0];
};

export const getCompany = async (secret: any) => {
    const res = await axios({
        method: 'get',
        url: `${API}/mb-companies-by-secret/${secret}`,
        headers: HEADERS
    });

    return res.data[0];
};