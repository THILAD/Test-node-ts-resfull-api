import { DataType, BuildOptions, DATE, Model, ModelAttributes, Sequelize, DataTypes } from "sequelize";
import { vendorBaseModel} from "../Base_model/vendor.base.model";
import * as bcryptjs from 'bcryptjs';
import { request } from "express";
export interface  vendorAttributes extends vendorBaseModel {
    role: string;
}
//model
export interface  vendorModel extends Model<vendorAttributes>, vendorAttributes {
    prototype: {
        validPassword: (password: string) => boolean;
        hashPassword: (password: string) => boolean;
    };
}
//object
export class vendorObject extends Model<vendorModel, vendorAttributes>{
    prototype: {
        validPassword: (password: string) => boolean;
        hashPassword: (password: string) => string;
    } | undefined;
}
// static object
export type vendorStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): vendorModel;
}
//entity hactory
export const vendorFactory = (name: string, sequelize: Sequelize): vendorStatic => {
    const attributes: ModelAttributes<vendorModel> = {
        id: { 
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING
        },
         vendor_ID: {
            type: DataTypes.TEXT, allowNull: false
        },
        vendor_product: {
            type: DataTypes.STRING, allowNull: false,  validate: { len: { args: [3, 20], msg: 'must be 3-20 digits' } }
        },
       
        vendor_username: {
            type: DataTypes.STRING, allowNull: false, unique: true, validate: { len: { args: [3, 20], msg: 'must be 3-20 digits' } }
        },
       
        vendor_password: {
            type: DataTypes.STRING,  validate: { len: { args: [3, 290], msg: 'must be 3-20 digits' } }
        },
        vendor_mobilephone: {
            type: DataTypes.STRING, unique: true, validate: { len: { args: [3, 20], msg: 'must be 3-20 digits' } }
        },
       
        vendor_useremail: {
            type: DataTypes.STRING, allowNull: false, defaultValue: true
        },
        vendor_catgory: {
            type: DataTypes.STRING, allowNull: false, defaultValue: true
        },
        vendor_avatar: {
            type: DataTypes.STRING, allowNull: false, defaultValue: true
        },
        vendor_last_login: {
            type: DataTypes.STRING, allowNull: false, defaultValue: true
        },
        vendor_status: {
            type: DataTypes.STRING, allowNull: false, defaultValue: true
        },
        isActive: {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true
        },
       
       
    } as ModelAttributes<vendorModel>;


    let x = sequelize.define(name, attributes, { tableName: name, freezeTableName: true });

    x.prototype.hashPassword = function (password: string): string {
        if (!password) return '';
        return this.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync())
    }
    x.prototype.validPassword = function (password: string): boolean {
        const str = password + this.vendor_username + this.vendor_mobilephone;
        console.log('valid password', str, "length", str.length);
        console.log('valid password', this.vendor_password);
        if (bcryptjs.compareSync(str, this.vendor_password)) return true;
        return false;
    }
    x.beforeCreate(async (user, options) => {
        if (user.changed('vendor_password')) {
            if (user.vendor_password && user.vendor_username && user.vendor_mobilephone) {
                const str = user.vendor_password + user.vendor_username + user.vendor_mobilephone;
                console.log('create password', str, "length", str.length);
                return bcryptjs.hash(str, bcryptjs.genSaltSync())
                    .then(hash => {
                        console.log('has', hash);
                        user.vendor_password = hash;
                    })
                    .catch(Error => {
                        throw new Error(Error);
                    });
            }
        }
    });

    x.beforeUpdate(async (user, option) => {
        if (user.changed('vendor_password')) {
            if (user.vendor_password && user.vendor_username && user.vendor_mobilephone) {
                const str = user.vendor_password + user.vendor_username + user.vendor_mobilephone;
                console.log('update password', str, "length", str.length);

                return bcryptjs.hash(str, bcryptjs.genSaltSync())
                    .then(hash => {
                        user.vendor_password = hash;
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
            }
        }
    });
    return x;
} 