import { BaseModel } from "./base_model";
export class BookDetailModel extends BaseModel{
    booking_id?:string;
    booking_name?:string
    booking_total?:string;
    booking_price_total?:string;
    booking_catgory?:string;
    booking_date_today?:string;
    booking_date_start?:string;
    booking_date_end?:string;
}