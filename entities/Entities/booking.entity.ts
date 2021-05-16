import { DataType, BuildOptions, DATE, Model, ModelAttributes, Sequelize, DataTypes } from "sequelize";
import {BookingBaseModel} from "../Base_model/booking.base.model";
//aatribute
export interface BookingAttributes extends BookingBaseModel {
    role:string
}
//  Model
export interface BookingModel extends Model<BookingAttributes>, BookingAttributes {
   
}
// object
export class CaBookinglist  extends Model<BookingAttributes,BookingAttributes>  {
  
}
// status object
export type Bookingstatic = typeof Model & {
    new(values?: object, options?: BuildOptions): BookingAttributes;
};

// entity factory
export const BookingFactory = (name: string, sequelize: Sequelize): Bookingstatic => {
    const attributes: ModelAttributes<BookingModel> = {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        booking_id_key: {
            type: DataTypes.STRING, allowNull: false,
        },
        booking_total: {
            type: DataTypes.STRING, allowNull: false, unique: false
        },
        booking_price_total:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        booking_date_start:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        booking_date_end:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        booking_status:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        isActive: {type:DataTypes.BOOLEAN,allowNull:false,defaultValue:true}
    }as ModelAttributes<BookingModel>;
        let x = sequelize.define(name,attributes,{tableName:name,freezeTableName:true});
        return x;
    }
