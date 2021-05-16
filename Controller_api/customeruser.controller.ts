

import { Request, Response, NextFunction, Application } from "express";
import { CustomerUserEntity, dbconnection } from "../entities";
import { CustomerUser, CustomerUserModel } from "../entities/Entities/customer.user.entity";
import { APIService } from "../services/api.service";
import {  Sequelize} from "sequelize";

export interface ILogin {
    customer_username: string;
    customer_password: string;
}
export interface IChangePassword {
    customer_username: string;
    customer_password: string;
    oldPassword: string;
}
export class UserController {
    app: Application;
    dbconnection: Sequelize;
    constructor(app: Application) {
        this.app = app;
        //dbconnection.authenticate().then(r => {
            //console.log('connection to sql', r);
            //sync
           // UserEntity.sync();
            //USERLIST
            //passed
            app.get('/customer', UserController.CustomerList)
                // LOGGED IN 
                .post('/customer/login', UserController.Login)

                .delete('/delete/customer/user', UserController.DeleteUser)
                .post('/get/user/details', UserController.checkAuthorize, UserController.GetCustomerDetails)
                .patch('/customer', UserController.UpdateCustomerUser)
                .patch('/reset/password', UserController.ResetPassword)
                .put('/customer/create',UserController.CreateUser)
       // });
    }
    //CRUD
    // get all user list passed thonthilad
    static CustomerList(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 5;
            const skip = req.query.limit ? Number(req.query.limit) : 0;
            CustomerUserEntity.findAll({ limit, offset: skip * limit }).then(r => {
                res.send(APIService.okRes(r));
            })
        } catch (error) {
            res.send(APIService.errRes(error))
        }
    }
    // get user detail passed thonthilad
    static GetCustomerDetails(req: Request, res: Response) {
        try {
            const id: number = req.body.id;
            CustomerUserEntity.findByPk(id).then(r => {
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
    static async CreateUser(req: Request, res: Response) {
        
        try {
            const user = req.body as CustomerUserModel;
            // console.log('44444444444444444444444',user);
            console.log(user.Customer_id,'okokkkkkkkkkkkkkkkkkkkkkkk');
            
            dbconnection.transaction().then(transaction => {
                // check exist use
                CustomerUserEntity.findOne({ 
                    where:
                     { 
                        role:user.role,
                        Customer_id: user.Customer_id, 
                        customer_username: user.customer_username, 
                        customer_password: user.customer_password, 
                        customer_mobilephone: user.customer_mobilephone, 
                        customer_useremail: user.customer_useremail, 
                        customer_avatar: user.customer_avatar, 
                        customer_last_login: user.customer_last_login
                        
                        }, transaction }).then(async r => {
                            
                            // console.log(r,'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
                            
                    if (r) {
                        await transaction.rollback();
                        res.send(APIService.errRes('User exist'));
                    }
                     else {
                        // console.log("result55555555555555555555555555555");
                        const InsertCustomer = {} as CustomerUserModel

                        InsertCustomer.role=user.role
                        InsertCustomer.Customer_id= user.Customer_id, 
                        InsertCustomer.customer_username= user.customer_username, 
                        InsertCustomer.customer_password= user.customer_password, 
                        InsertCustomer.customer_mobilephone= user.customer_mobilephone, 
                        InsertCustomer.customer_useremail= user.customer_useremail, 
                        InsertCustomer.customer_avatar= user.customer_avatar, 
                        InsertCustomer.customer_last_login= user.customer_last_login
                        // console.log(InsertCustomer,'okookkokokokoookokok');
                        
                        CustomerUserEntity.create(InsertCustomer).then(r => {
                            res.send(APIService.okRes(r, 'created ok'));
                        }).catch(e => {
                            res.send(APIService.errRes(e,'create error'));
                        })
                    }
                })
            });
        } catch (error) {
            res.send(APIService.errRes(error));
        }
        // const transaction = await dbConnection.transaction();
    }
    //update user passed thonthilad
    static UpdateCustomerUser(req: Request, res: Response) {
        
        try {
            const id = req.body.id + '';
            const users = req.body as CustomerUserModel;
            // console.log(id,'5555555555555555555555555555555555');
            
            CustomerUserEntity.findByPk(id).then(async r => {
                console.log('okokookooko',r);
                
                if (r) {
                    r['role']=users.role,
                    r['Customer_id'] = users.Customer_id,
                    r['customer_username'] = users.customer_username,
                    r['customer_password'] = users.customer_password,
                    r['customer_mobilephone'] = users.customer_mobilephone,
                    r['customer_useremail'] = users.customer_useremail,
                    r['customer_avatar'] = users.customer_avatar,
                    r['customer_last_login'] = users.customer_last_login,
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
    static  DeleteUser(req: Request, res: Response) {
        
        let id = req.body.id + '';
        CustomerUserEntity.findByPk(id).then(async r => {
            let x = r.destroy();
            res.send({ status: 1, data: x, message: 'Delete OK' })
        }).catch(e => {
            res.send({ status: 0, data: e, message: 'Delete failed' })

        })
    }
    
    static ResetPassword(req: Request, res: Response) {
        const login = req.body as ILogin;
        if (login.customer_username && login.customer_password) {
            CustomerUserEntity.findOne({ where: { customer_username: login.customer_username } }).then(r => {
                if (r) {
                    r.password = login.customer_password;
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
    // TOUY 14/09/2020 adde changepassword
    //   static ChangePassword(req: Request, res: Response) {
    //     const login = req.body as IChangePassword;
    //     console.log('CCCCCCCCCCCCCC',req['_user']);
    //     const _user = req['_user'] as UserModel;
    //     console.log('_User',_user);

    //     if (login.userName===_user.userName && login.password&&login.password.length>5&&login.password.length<51&&login.oldPassword) {
    //         UserEntity.findOne({ where: { userName: login.userName } }).then(r => {
    //             if(r){
    //                 if(r.validPassword(login.oldPassword)){
    //                     r.password=login.password;
    //                     r.save();
    //                     res.send(APIService.okRes('change password ok'));
    //                 }
    //                 else{
    //                     res.send(APIService.errRes('wrong password'));
    //                 }
    //             }
    //             else {
    //                 res.send(APIService.errRes('user not found'));
    //             }

    //         }).catch(e => {
    //             console.log('error login ', e);

    //             res.send(APIService.errRes(e, 'Error Reset password'));
    //         })

    //     } else {
    //         res.send(APIService.errRes('Empty username or password'));
    //     }
    // }

    //Post login
    static Login(req: Request, res: Response) {
        const login = req.body as ILogin;
        if (login.customer_username && login.customer_password) {
            CustomerUserEntity.findOne({ where: { customer_username: login.customer_username } }).then(r => {
                console.log('login r', r);

                if (r) {
                    console.log('valid',r.validPassword(login.customer_password));
                    
                        if (r.validPassword(login.customer_password)) {
                            const user = APIService.clone(r);
                            delete user.role;
                            delete user.customer_password;
                            delete user.customer_mobilephone;
                            const token = APIService.createToken(user as CustomerUserModel);
                            res.setHeader('authorization', token);
                            res.send(APIService.okRes({ user, token }, 'Login OK'));
                        }
                        else {
                            res.send(APIService.errRes('Incorrect password'));
                        
                    }
                } else {
                    res.send(APIService.errRes('Username not found'));

                }
            }).catch(e => {
                console.log('error login ', e);

                res.send(APIService.errRes(e, 'Error login'));
            })

        } else {
            res.send(APIService.errRes('Empty username or password'));
        }
    }
    //echeck addmin  authori
    static CheckAdminAuthorization(req: Request, res: Response, next: NextFunction) {
        const login = req.body as ILogin;
        if (login.customer_username && login.customer_password) {
            if (login.customer_username === 'super-admin' && login.customer_password === '55F^fFS`},srzWc[b[]e{2F~/.#SQw') {
                return next();
            }
        }
        res.status(402).send('You have no an authorization!')

    }
    // authorization
    static checkAuthorize(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization'] + '';
        const newToken = APIService.validateToken(token);
        req.headers['authorization'] = newToken;
        res.setHeader('authorization', newToken);
        if (newToken) {
            next();
        }
        else {
            res.status(402).send('You have no an authorization!')
        }
    }
    static checkIsYourSelf(req: Request, res: Response, next: NextFunction) {
        if (APIService.checkMySelf(req.headers['authorization'] + '', req)) {
            next();
        } else {
            res.status(402).send('You have no an authorization!')
        }
    }
    static CheckAdminAuthorizeToken(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['super-admin-authorization'] + '';

        if (APIService.vatlidateSuperAdmin(token)) {
            return next();
        }
        // else {
        res.status(402).send('You have no an authorization!')
        // }
    }

}





