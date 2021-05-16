import { BaseModel } from "./base_model";
export class vendorBaseModel extends BaseModel{
    vendor_ID?:string;
    vendor_product?:string;  // name product
    vendor_username?: string; //name user
    vendor_password?:string;
    vendor_mobilephone?:string;
    vendor_useremail?:string;
    vendor_catgory?:string;
    vendor_avatar?:string;
    vendor_last_login?:string;
    vendor_status?:string;
    validPassword:(password:string)=>boolean;
    hashPassword:(password:string)=>boolean;
}
