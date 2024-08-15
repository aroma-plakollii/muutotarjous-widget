import axios from "axios";
import {API} from "../config";
import {HEADERS} from "../config";

export const getPackagePrice = async (data: any) => {
    const res = await axios({
        method: 'post',
        url: `${API}/get-package-price`,
        data: data,
        headers: HEADERS
    });

    return res.data;
};

export const getDayPrice = async (data: any) => {
    const res = await axios({
        method: 'POST',
        url: `${API}/get-day-price`,
        data: data,
        headers: HEADERS
    });

    return res.data;
};

export const storeBooking = async (data: any) => {
    const res = await axios({
        method: 'POST',
        url: `${API}/mb-bookings-create`,
        data: data,
        headers: HEADERS
    });

    return res.data;
};

export const checkCoupon = async (data: any) => {
    console.log('1 ', data)
    try {
        const response = await axios.post(`${API}/check-coupon`, data);

        console.log('2 ', response)

        return response.data;
    }
    catch (e: any) {
        return e;
    }
}