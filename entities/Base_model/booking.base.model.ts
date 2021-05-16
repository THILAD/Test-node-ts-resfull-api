import { BaseModel } from "./base_model";
export class BookingBaseModel extends BaseModel{
    booking_id_key?:string;
    booking_total?:string;
    booking_price_total?:string;
    booking_date_start?:string;
    booking_date_end?:string;
    booking_status?:string;

}