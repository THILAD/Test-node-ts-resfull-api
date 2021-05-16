
import { Request, Response, NextFunction, Application } from "express";
import { VendorEntity} from "../entities";
import { vendorModel } from "../entities/Entities/vendor.entity";
import { APIService } from "../services/api.admin.service";
import { Sequelize } from "sequelize";
import {redisClient} from './index'

export interface ILogin {
    id: any;
    vendor_username: string;
    vendor_password: string;
}
export interface IChangePassword {
    vendor_username: string;
    vendor_password: string;
    oldPassword: string;
}
export class AuthCheckLogin {
    app: Application;
    dbconnection: Sequelize;
    
    constructor(app: Application) {
        this.app = app;
        
            app.post('/login/vendor', AuthCheckLogin.Login)
            //     .delete('/delete/customer/user', UserController.)
            .get('/vendor/logout',AuthCheckLogin.Logout)
            .patch('/vendor/reset/password', AuthCheckLogin.ResetPassword)
    }
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
    static setRedisToken(t:string,v:string){
        redisClient.set(t,v,'EX', 3*60);
    }
    static Login(req: Request, res: Response) {
        const login = req.body as ILogin;
        console.log('5555555555555555555555555',login);

        if (login.vendor_username && login.vendor_password) {
            VendorEntity.findOne({ where: { vendor_username: login.vendor_username } }).then(r => {
                console.log('login r', r);
                if (r) {
                    
console.log('valid password',r.validPassword);

                    if (r.validPassword(login.vendor_password)) {
                        console.log("ttttttttttttttttttttttttttttttttttttt");
                        const user = APIService.clone(r);
                        console.log('rrrrrrrrrrrrrrrrrr', r);
                        delete user.role;
                        delete user.vendor_password;
                        delete user.customer_mobilephone;
                        const token = APIService.createToken(user as vendorModel);
                        AuthCheckLogin.setRedisToken(token,token);
                        //check
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

    //logout s
    static Logout ( session:any, req: Request, res: Response){
        // const newLocal = req.session = null;
        const logout = req.body.id as ILogin;
        VendorEntity.findOne({ where: { vendor_username: logout.vendor_username } }).then(r=>{
           if ( r.vendor_username = logout.vendor_username){
            const token = req.headers['authorization'] + '';
            redisClient.del(token);

            logout.id = null;
            delete logout.vendor_username;
           }
        })
        
    
    }
    // checheck addmin  authori
    static CheckAdminAuthorization(req: Request, res: Response, next: NextFunction) {
        const login = req.body as ILogin;
        if (login.vendor_username && login.vendor_password) {
            if (login.vendor_username === 'super-admin' && login.vendor_password === '55F^fFS`},srzWc[b[]e{2F~/.#SQw') {
                return next();
            }
        }
        res.status(402).send('You have no an authorization!')

    }
    // check authorization
    static checkAuthorize(req: Request, res: Response, next: NextFunction) {
        const token = req.headers['authorization'] + '';

        redisClient.get(token,(e,r)=>{
            if(e){
                res.status(402).send('You have no an authorization!');
                console.log(e);
            }else{
                if(r==token){
                    const newToken = APIService.validateToken(token);
                    req.headers['authorization'] = newToken;
                    res.setHeader('authorization', newToken);
                    if (newToken) {
                        AuthCheckLogin.setRedisToken(newToken,newToken);
                        next();
                    }
                    else {
                        res.status(402).send('You have no an authorization!');
                    }
                }
            }
        });
       
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
        else {
            res.status(402).send('You have no an authorization!')
        }
    }

}

