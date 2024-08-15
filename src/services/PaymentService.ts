import axios from "axios";
import {API} from "../config";
import {HEADERS} from "../config";
import exp from "constants";
import moment from "moment";

export const updatePayment = async (booking_number: string | null | undefined) => {
    const res = await axios({
        method: 'post',
        data: {
            booking_number: booking_number,
        },
        url: `${API}/mb-bookings-update-payment`,
        headers: HEADERS
    });

    return res.data;
};