import { DataType, BuildOptions, DATE, Model, ModelAttributes, Sequelize, DataTypes } from "sequelize";
import {BookDetailModel} from "../Base_model/book.base.detail";
//aatribute
export interface BookingDetailAttributes extends BookDetailModel {
    role:string
}
//  Model
export interface  BookingDetailModel extends Model<BookingDetailAttributes>, BookingDetailAttributes {
   
}
// object
export class CaBookingDetaillist  extends Model<BookingDetailAttributes,BookingDetailAttributes>  {
  
}
// status object
export type BookingDetailstatic = typeof Model & {
    new(values?: object, options?: BuildOptions): BookingDetailAttributes;
};

// entity factory
export const BookingDetailFactory = (name: string, sequelize: Sequelize): BookingDetailstatic => {
    const attributes: ModelAttributes<BookingDetailModel> = {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        booking_id: {
            type: DataTypes.STRING, allowNull: false,
        },
        booking_name: {
            type: DataTypes.STRING, allowNull: false, unique: false
        },
        booking_total: {
            type: DataTypes.STRING, allowNull: false, unique: false
        },
        booking_price_total:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        booking_catgory:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        booking_date_today:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        booking_date_start:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        booking_date_endt:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        isActive: {type:DataTypes.BOOLEAN,allowNull:false,defaultValue:true}
    }as ModelAttributes<BookingDetailModel>;
        let x = sequelize.define(name,attributes,{tableName:name,freezeTableName:true});
        return x;
    }
