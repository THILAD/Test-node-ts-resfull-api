import { DataType, BuildOptions, DATE, Model, ModelAttributes, Sequelize, DataTypes } from "sequelize";
import { CatgoryBaseModel } from "../Base_model/catgory.base.model";
//aatribute
export interface CatgoryAttributes extends CatgoryBaseModel {
    role:string
}
//  Model
export interface CatgoryModel extends Model<CatgoryAttributes>, CatgoryAttributes {
   
}
// object
export class Catgorylist  extends Model<CatgoryAttributes,CatgoryAttributes>  {
  
}
// status object
export type Catgorystatic = typeof Model & {
    new(values?: object, options?: BuildOptions): CatgoryAttributes;
};

// entity factory
export const CatgoryFactory = (name: string, sequelize: Sequelize): Catgorystatic => {
    const attributes: ModelAttributes<CatgoryModel> = {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        catgory_id: {
            type: DataTypes.STRING, allowNull: false,
        },
        catgory_name: {
            type: DataTypes.STRING, allowNull: false, unique: false
        },
        catgory_description:{
            type:DataTypes.STRING, allowNull:false,unique:false
        },
        isActive: {type:DataTypes.BOOLEAN,allowNull:false,defaultValue:true}
    }as ModelAttributes<CatgoryModel>;
        let x = sequelize.define(name,attributes,{tableName:name,freezeTableName:true});
        return x;
    }
