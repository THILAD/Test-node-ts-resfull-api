import {  Sequelize} from "sequelize";
import { CustomerUserFactory } from "./Entities/customer.user.entity";
import { vendorFactory } from "./Entities/vendor.entity";
import { CatgoryFactory } from "./Entities/catgory.entity";
import { RoomFactory } from "./Entities/room.entity";
import { BookingFactory } from "./Entities/booking.entity";
import { BookingDetailFactory } from "./Entities/booking.detail";
export const dbconnection = new Sequelize('Alo-app','root','',{
    host:'localhost',
    dialect:'mysql'
});
//data base  name customeruser
export enum EntityCustomerPrifix{
    Customer_user='customeruser',
    Messagssses='Messages 123432'
}
//data base  name vendors
export enum EntityVendorPrifix{
    vendor_user='vendors',
    Msg='Messages 123432'
}
//data base  name catgory_room
export enum EntityCatgoryPrifix{
    Catgory_room='catgory_room',
    Msg2='Messages 123432'
}
//data base  name product_room
export enum EntityRoomPrifix{
    Room_room='product_room',
    Msg3='Messag product room'
}
//data base  name booking_room
export enum EntityBookingPrifix{
    Booking_='booking_room',
    Msg='Messages 123432'
}
//data base  name booking_detail

export enum EntityBookDetailPrifix{
    Booking_detail='booking_detail',
    Msg='Messages 123432'
}
export const CustomerUserEntity= CustomerUserFactory(EntityCustomerPrifix.Customer_user,dbconnection);
export const VendorEntity= vendorFactory(EntityVendorPrifix.vendor_user,dbconnection);
export const CatgoryEntity= CatgoryFactory(EntityCatgoryPrifix.Catgory_room,dbconnection);
export const RoomEntity= RoomFactory(EntityRoomPrifix.Room_room,dbconnection);
export const BookingEntity= BookingFactory(EntityBookingPrifix.Booking_,dbconnection);
export const BookDetailEntity= BookingDetailFactory(EntityBookDetailPrifix.Booking_detail,dbconnection);





export function initDB():Promise<Sequelize>{
    return new Promise<Sequelize>(async (resolve,reject)=>{
        try {
         await CustomerUserEntity.sync();
         await VendorEntity.sync();
         await CatgoryEntity.sync();
         await RoomEntity.sync();
         await BookingEntity.sync();
         await BookDetailEntity.sync();

         resolve(dbconnection)
        } catch (error) {
            reject(error);
        }
    
    });
     
 }