

import { Request, Response, NextFunction, Application } from "express";
import { VendorEntity, dbconnection } from "../entities";
import { vendorModel } from "../entities/Entities/vendor.entity";
import { APIService } from "../services/api.admin.service";
import { Sequelize } from "sequelize";

export interface ILogin {
    vendor_username: string;
    vendor_password: string;
}
export interface IChangePassword {
    vendor_username: string;
    vendor_password: string;
    oldPassword: string;
}
export class VendorController {
    app: Application;
    dbconnection: Sequelize;
    constructor(app: Application) {
        this.app = app;
        // dbconnection.authenticate().then(r => {
        //console.log('connection to sql', r);
        //sync
        // UserEntity.sync();
        //USERLIST
        //passed
        app.get('/vendor', VendorController.VendorList)
            // .post('/get/user/details', VendorController.checkAuthorize, VendorController.GetVendorDetails)
            .patch('/vendor/update', VendorController.UpdateVendor)
            .patch('/vendor/reset/password', VendorController.ResetPassword)
            .put('/vendor/create', VendorController.CreateVendorUser)

    }
    //CRUD
    // get all user list passed thonthilad
    static VendorList(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 5;
            const skip = req.query.limit ? Number(req.query.limit) : 0;
            VendorEntity.findAll({ limit, offset: skip * limit }).then(r => {
                res.send(APIService.okRes(r));
            })
        } catch (error) {
            res.send(APIService.errRes(error))
        }
    }
    // get user detail passed thonthilad
    static GetVendorDetails(req: Request, res: Response) {
        try {
            const id: number = req.body.id;
            VendorEntity.findByPk(id).then(r => {
                if (r) {
                    const u = APIService.clone(r);
                    delete u.role;
                    delete u.password;
                    return res.send(APIService.okRes(u));
                } else {
                    // res.send(APIService.errRes({}));
                }
                // const token = APIService.requestToken(req);
            }).catch(e => {
                res.send(APIService.errRes(e));
            })
        } catch (error) {
            console.log(error);
            res.send(APIService.errRes(error))
        }
    }
    //create user passed by thonthilad 23/11/2020
    static async CreateVendorUser(req: Request, res: Response) {

        try {
            const user = req.body as vendorModel;
            dbconnection.transaction().then(transaction => {
                // check exist use
                VendorEntity.findOne({
                    where:
                    {
                        vendor_username: user.vendor_username,
                        vendor_mobilephone: user.vendor_mobilephone,
                    }, transaction
                }).then(async r => {
                    console.log(r, 'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
                    if (r) {
                        await transaction.rollback();
                        res.send(APIService.errRes('User exist'));
                    }
                    else {
                        const InsertVendor = {} as vendorModel
                        console.log("result55555555555555555555555555555", InsertVendor);
                        InsertVendor.role = user.role,
                            InsertVendor.vendor_ID = user.vendor_ID,
                            InsertVendor.vendor_product = user.vendor_product,
                            InsertVendor.vendor_username = user.vendor_username
                        InsertVendor.vendor_password = user.vendor_password
                        InsertVendor.vendor_mobilephone = user.vendor_mobilephone
                        InsertVendor.vendor_useremail = user.vendor_useremail
                        InsertVendor.vendor_catgory = user.vendor_catgory
                        InsertVendor.vendor_avatar = user.vendor_avatar
                        InsertVendor.vendor_last_login = user.vendor_last_login
                        InsertVendor.vendor_status = user.vendor_status
                        VendorEntity.create(InsertVendor).then(r => {
                            res.send(APIService.okRes(r, 'created ok'));
                        }).catch(e => {
                            res.send(APIService.errRes(e, 'create error'));
                        })
                    }
                })
            });
        } catch (error) {
            res.send(APIService.errRes(error));
        }
        // const transaction = await dbConnection.transaction();
    }
    //update user passed thonthilad 2020/22/23
    static UpdateVendor(req: Request, res: Response) {

        try {
            const id = req.body.id + '';
            const users = req.body as vendorModel;
            VendorEntity.findByPk(id).then(async r => {
                console.log('okokookooko', r);
                if (r) {
                    r['role'] = users.role,
                        r['vendor_ID'] = users.vendor_ID,
                        r['vendor_product'] = users.vendor_product,
                        r['vendor_username'] = users.vendor_username,
                        r['vendor_password'] = users.vendor_password,
                        r['vendor_mobilephone'] = users.vendor_mobilephone,
                        r['vendor_useremail'] = users.vendor_useremail,
                        r['vendor_last_login'] = users.vendor_last_login,
                        r['vendor_last_login'] = users.vendor_last_login,
                        r['vendor_avatar'] = users.vendor_avatar,
                        res.send({ status: 1, data: await r.save(), message: 'update OK' });
                    res.send(APIService.okRes(r, 'created ok'));
                }
            }).catch(e => {
                res.send({ status: 0, data: e, message: 'update failed' });
            });
        } catch (e) {
            res.send(APIService.errRes(e));
            console.log(e);
        }
    }
    //delete user passed thonthilad
    static DeleteVendor(req: Request, res: Response) {
        let id = req.body.id + '';
        VendorEntity.findByPk(id).then(async r => {
            let x = r.destroy();
            res.send({ status: 1, data: x, message: 'Delete OK' })
        }).catch(e => {
            res.send({ status: 0, data: e, message: 'Delete failed' })

        })
    }
    static ResetPassword(req: Request, res: Response) {
        const login = req.body as ILogin;
        if (login.vendor_username && login.vendor_password) {
            VendorEntity.findOne({ where: { vendor_username: login.vendor_username } }).then(r => {
                if (r) {
                    r.vendor_password = login.vendor_password;
                    r.save();
                    res.send(APIService.okRes('Reset password ok'));
                }
                else {
                    res.send(APIService.errRes('user not found'));
                }

            }).catch(e => {
                console.log('error login ', e);

                res.send(APIService.errRes(e, 'Error Reset password'));
            })

        } else {
            res.send(APIService.errRes('Empty username or password'));
        }
    }
}

