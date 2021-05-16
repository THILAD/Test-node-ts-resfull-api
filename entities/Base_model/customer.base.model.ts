import { BaseModel } from "./base_model";
export class Customer_user extends BaseModel{
    Customer_id?:string;
    customer_username?: string;
    customer_password?:string;
    customer_mobilephone?:number;
    customer_useremail?:string;
    customer_avatar?:string;
    customer_last_login?:string;
    validPassword:(password:string)=>boolean;
    hashPassword:(password:string)=>boolean;
}