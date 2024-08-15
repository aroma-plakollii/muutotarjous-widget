import axios from "axios";
import {API} from "../config";
import {HEADERS} from "../config";
import exp from "constants";
import moment from "moment";

export const getBooking = async (id: any) => {
    const res = await axios({
        method: 'get',
        url: `${API}/mb-bookings-continue/${id}`,
        headers: HEADERS
    });

    return res.data[0];
};

export const getContinuePrice = async (data: any) => {
    const res = await axios({
        method: 'post',
        data: {
            id: data.id,
            date: data.date,
        },
        url: `${API}/mb-prices-continue`,
        headers: HEADERS
    });

    return res.data;
};

export const getBlockedDates = async (id: any) => {
    const res = await axios({
        method: 'get',
        url: `${API}/mb-blocked-dates-by-company/${id}`,
        headers: HEADERS
    });

    console.log(res)

    return res.data;
}

export const storeAdditionalDays = async (data: any) => {
    const res = await axios({
        method: 'post',
        data: {
            booking_id: data.booking_id,
            date: data.date,
            price: data.price,
            quantity: data.quantity,
        },
        url: `${API}/mb-additional-days-create`,
        headers: HEADERS
    });

    return res.data;
}