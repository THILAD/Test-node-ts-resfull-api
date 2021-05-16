import { Customer_user } from '../entities/Base_model/customer.base.model';
import { dbconnection,initDB } from "../entities";

import { Application } from "express";

import { RoomController } from './Room.Controllers';
import {AuthCheckLogin} from "./auth.controllers"
import { UserController} from "./customeruser.controller";
import {VendorController} from "./vendor.controller";
import  redis from "redis";
export const redisClient = redis.createClient();
export function Init(app: Application) {
        initDB().then(r=>{
            // console.log('connection to sql', r);
              new AuthCheckLogin(app);//login logout
             new UserController(app);// routing
             new VendorController(app);// routing
             new RoomController(app);
            // new HotelController(app);
            // new ApartmentController(app);
            // new BookingController(app);
        }).catch(e=>{
            console.log(e);
            
        })
    
}
