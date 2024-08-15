import axios from "axios";
import {API} from "../config";

export const getBlockedDates = async (id: number) => {
    const res = await axios({
        method: 'get',
        url: `${API}/mb-blocked-dates-by-company/${id}`,
    });

    return res.data;
};
