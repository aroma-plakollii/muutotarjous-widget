import * as React from 'react';
import {IBlockedDates} from "../models/IBlockedDates";

interface Address {
    name?: string;
    city?: string;
    placeId?: string;
    address_number?: string;
}

export interface MovingBoxesForm {
    productId: string;
    companyId: string;
    quantity: any;
    start_number: string;
    start_code: string;
    end_number: string;
    end_code: string;
    start_time: string;
    end_time: string;
    address: {
        start_address: Address | null;
        end_address: Address | null;
    };
    dates: {
        startDate: Date;
        endDate: Date;
    };
    paymentDetails: {
        first_name: string;
        last_name: string;
        phone: string;
        email: string;
        paymentMethod: string;
    };
    priceDetails: {
        price: number,
        roadPrice: number,
        totalPrice: number
    };
}

export interface Company {
    id: number;
    user_id: number;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string,
    business_number: string;
    private_key: string;
    api_key: string;
    secret_key: string;
    status: boolean;
    created_at: Date;
    updated_at: Date;
}

export interface PriceDetails {
    id: number,
    company_id: number,
    price_per_day: number,
    price_per_package: number,
    price_per_km: number,
    booking_price: number,
    additional_price: number,
    additional_package_price: number,
    package_days: number,
    included_km: number,
    min_boxes: number,
    type: string,
    created_at: Date,
    updated_at: Date,
}

export interface Price {
    start_distance_price: number;
    end_distance_price: number;
    rent_price: number;
    base_price: number;
    total: number;
}

export interface BlockedDate {
    id: number,
    company_id: number,
    date: Date,
    status: boolean,
    created_at: Date;
    updated_at: Date;
}

export interface GlobalState {
    step: number;
    priceDetails: PriceDetails;
    companySecret: string,
    company: Company,
    movingServiceForm: MovingBoxesForm;
    type: string;
    box_type: string;
    blockedDates: BlockedDate[];
    price: Price;
    coupon_code: string;
}

interface GlobalContext {
    globalState: GlobalState,
    setGlobalState: (x: GlobalState) => void
}

const GlobalContext = React.createContext({} as GlobalContext);

export default GlobalContext;
