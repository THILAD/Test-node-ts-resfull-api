import { DataType, BuildOptions, DATE, Model, ModelAttributes, Sequelize, DataTypes } from "sequelize";
import { Customer_user} from "../Base_model/customer.base.model";
import * as bcryptjs from 'bcryptjs';
import { request } from "express";
export interface CustomerUserAttributes extends Customer_user {
    role: string;
}
//model
export interface CustomerUserModel extends Model<CustomerUserAttributes>, CustomerUserAttributes {
    password: string;
    prototype: {
        validPassword: (password: string) => boolean;
        hashPassword: (password: string) => boolean;
    };
}
//object
export class CustomerUser extends Model<CustomerUserModel, CustomerUserAttributes>{
    prototype: {
        validPassword: (password: string) => boolean;
        hashPassword: (password: string) => string;
    } | undefined;
}
// static object
export type CustomerUserStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): CustomerUserModel;
}
//entity hactory
export const CustomerUserFactory = (name: string, sequelize: Sequelize): CustomerUserStatic => {
    const attributes: ModelAttributes<CustomerUserModel> = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
            allowNull: false
        },
        Customer_id : {
            type: DataTypes.STRING, allowNull: false
        }, 
        customer_username: {
            type: DataTypes.STRING, allowNull: false
        },
        customer_password: {
            type: DataTypes.TEXT, allowNull: false

        },
        role: {
            type: DataTypes.STRING 
        },
        customer_mobilephone : {
            type: DataTypes.BIGINT,  validate: { len: { args: [3, 20], msg: 'must be 3-20 digits' } }

        },
        customer_useremail : {
            type: DataTypes.STRING,  allowNull: false
        },
        
        customer_avatar : {
            type: DataTypes.STRING,   allowNull: false
        },
        customer_last_login : {
            type: DataTypes.STRING,   allowNull: false
        },
       
        isActive: {
            type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true
        },
       
    } as ModelAttributes<CustomerUserModel>;


    let x = sequelize.define(name, attributes, { tableName: name, freezeTableName: true });

    x.prototype.hashPassword = function (password: string): string {
        if (!password) return '';
        return this.password = bcryptjs.hashSync(password, bcryptjs.genSaltSync())
    }
    x.prototype.validPassword = function (password: string): boolean {
        const str = password + this.customer_username + this.customer_mobilephone;
        console.log('valid password', str, "length", str.length);
        console.log('valid password', this.customer_password);
        if (bcryptjs.compareSync(str, this.customer_password)) return true;
        return false;
    }
    x.beforeCreate(async (user, options) => {
        if (user.changed('customer_password')) {
            if (user.customer_password && user.customer_username && user.customer_mobilephone) {
                const str = user.customer_password + user.customer_username + Number(user.customer_mobilephone);
                console.log('create password', str, "length", str.length);
                return bcryptjs.hash(str, bcryptjs.genSaltSync())
                    .then(hash => {
                        console.log('has', hash);
                        user.customer_password = hash;
                    })
                    .catch(Error => {
                        throw new Error(Error);
                    });
            }
        }
    });

    x.beforeUpdate(async (user, option) => {
        if (user.changed('customer_password')) {
            if (user.customer_password && user.customer_username && user.customer_mobilephone) {
                const str = user.customer_password + user.customer_username +  Number(user.customer_mobilephone);
                console.log('update password', str, "length", str.length);

                return bcryptjs.hash(str, bcryptjs.genSaltSync())
                    .then(hash => {
                        user.customer_password = hash;
                    })
                    .catch(err => {
                        throw new Error(err);
                    });
            }
        }
    });
    return x;
} 