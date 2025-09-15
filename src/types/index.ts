export interface Event {
    id: number;
    title: string;
    event_start_date: string;
    event_venue_name: string;
    start_time: string;
    start_minute_time: string;
    start_time_type: string;
    end_time: string;
    end_minute_time: string;
    end_time_type: string;
    image: string;
    qr_code: string;
    printer_count: number;
    uuid: string;
}

export interface User {
    id: number;
    email: string;
    name: string;
    access_token: string;
    access_token_type: string;
    company_name: string;
    message: string;
    status: number;
    user_id: number;
    user_uuid: string;
}
