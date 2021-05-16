import { BaseModel } from "./base_model";
export class roomBaseModel extends BaseModel{
    room_name?: string;
    room_catgory?: string;
    room_price?: string;
    room_location?: string;
    room_description?: string;
    room_images?: string;
    room_total?: string; 
    room_status?: string; 
    room_Idvendor?:string
}