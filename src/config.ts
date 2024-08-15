import axios from "axios";

export const API = "http://127.0.0.1:8000/api";

export const HEADERS = {
    'Content-Type': 'application/json',
    // 'Authorization': `Bearer ${sessionStorage.getItem('token')}`
}

export const GMAPKEY = "AIzaSyCzcvmKLAUO3TdD78Pc8Z0sYpJmntfnLc0";

export const getCompanyId = async () => {
    let secret: any = sessionStorage.getItem("company_secret");

    const res = await axios({
        method: 'get',
        url: `${API}/mb-companies-by-secret/${secret}`,
        headers: HEADERS
    });

    return res.data[0].id;
}