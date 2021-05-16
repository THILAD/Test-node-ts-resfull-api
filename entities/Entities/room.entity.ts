import { DataType, BuildOptions, DATE, Model, ModelAttributes, Sequelize, DataTypes } from "sequelize";
import { roomBaseModel } from "../Base_model/Room.base.model";
//aatribute
export interface RoomAttributes extends roomBaseModel {
    role:string
}
//  Model
export interface RoomModel extends Model<RoomAttributes>, RoomAttributes {
   
}
// object
export class Roomlist  extends Model<RoomAttributes,RoomAttributes>  {
  
}
// status object
export type Roomstatic = typeof Model & {
    new(values?: object, options?: BuildOptions): RoomAttributes;
};

// entity factory
export const RoomFactory = (name: string, sequelize: Sequelize): Roomstatic => {
    const attributes: ModelAttributes<RoomModel> = {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        room_name: {
            type: DataTypes.STRING, allowNull: false,
        },
        room_catgory: {
            type: DataTypes.STRING, allowNull: false, 
        },
        room_price:{
            type:DataTypes.STRING, allowNull:false,
        },
        room_location:{
            type:DataTypes.STRING, allowNull:false,
        },
        room_description:{
            type:DataTypes.STRING, allowNull:false,
        },
        room_images:{
            type:DataTypes.STRING, allowNull:false,
        },
        room_total:{
            type:DataTypes.STRING, allowNull:false,
        },
        room_status:{
            type:DataTypes.STRING, allowNull:false,
        },
        room_Idvendor:{
            type:DataTypes.STRING, allowNull:false,
        },
        isActive: {type:DataTypes.BOOLEAN,allowNull:false,defaultValue:true}
    }as ModelAttributes<RoomModel>;
        let x = sequelize.define(name,attributes,{tableName:name,freezeTableName:true});
        return x;
    }
