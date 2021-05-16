import { RoomEntity, dbconnection } from '../entities';
import { Request, Response, Application } from "express";
import * as fs from 'fs';
import { RoomModel } from '../entities/Entities/room.entity';



export class RoomController {
    app: Application;
    constructor(app: Application) {
        this.app = app;
        app.get('/room/vendor', RoomController.GetAllRoom)
            .delete('/room/vendor', RoomController.DeleteRoomList)
            .post('/room/vendor', RoomController.GetRoomDetail)
            .patch('/room/vendor', RoomController.UpdateRoomList)
            .put('/room/vendor', RoomController.CreateRoomlist)
       
    }
    // show hotel list
    static GetAllRoom(req: Request, res: Response) {
        try {
            const limit = req.query.limit ? Number(req.query.limit) : 11;
            const skip = req.query.skip ? Number(req.query.skip) : 0;
            RoomEntity.findAll({ limit, offset: skip * limit, order: [['id', 'DESC']] }).then(r => {
                res.send({ message: 'Ok', status: 1, data: r })

            }).catch(e => {
                res.send({ status: 0, data: e })
            })
        } catch (error) {
            res.send({ status: 0, data: error })
        }
    }
    //SHOW JOB LIST SOME ID
    static GetRoomDetail(req: Request, res: Response) {
        try {
            const id: number = req.body.id;
            RoomEntity.findByPk(id).then(r => {
                res.send({ status: 1, data: r });
                console.log('xxxxx id', id);
            }).catch(e => {
                res.send({ status: 0, data: e })
            })
        } catch (error) {
            res.send({ status: 0, data: error })
        }
    }
    static CreateRoomlist(req: Request, res: Response) {

        {
            const Room = req.body;
            // const image = Room.room_images.img;
            // var filename = "images/" + Date.now() + Room.room_images.name;
            // fs.writeFileSync(filename, image.split(';base64,').pop(), { encoding: 'base64' });
            // req.body.image = filename;
            dbconnection.transaction().then(transaction => {
                RoomEntity.findOne({
                    where: {
                    }
                }).then(async r => {
                    if (r) {
                        await transaction.rollback();
                    } else {
                        const InsertRoom = {} as RoomModel;
                        InsertRoom.room_name = Room.room_name
                        InsertRoom.room_catgory = Room.room_catgory
                        InsertRoom.room_price = Room.room_price
                        InsertRoom.room_location = Room.room_location
                        InsertRoom.room_description = Room.room_description
                        InsertRoom.room_images = Room.room_images
                        InsertRoom.room_total = Room.room_total
                        InsertRoom.room_status = Room.room_status
                        InsertRoom.room_Idvendor = Room.room_Idvendor
                        RoomEntity.create(InsertRoom).then(r => {
                            res.send({ status: 1, data: [], r })
                            console.log(r);

                        })
                            .catch(e => {
                                res.send({ status: 0, data: e })
                            })
                    }
                })
            })
        }

    }

    // delete passed
    static DeleteRoomList(req: Request, res: Response) {
        console.log('----------------------------------');

        let id = req.query.id + '';
        RoomEntity.findByPk(id).then(async r => {
            console.log('xxxxxxxxxxxxx id', id);

            let x = r.destroy();
            res.send({ status: 1, data: x, meeage: 'delete OK' });
        }).catch(e => {
            res.send({ status: 0, data: e });
        });
    }
    //UpdateJobList
    // passed
    static UpdateRoomList(req: Request, res: Response) {
        let id = req.body.id + '';
        let hotel = req.body;
        var filename: string | number | Buffer | URL;
        if (hotel.fileBase64upload) {
            const imagess = hotel.fileBase64upload.img;
            filename = "images/" + Date.now() + hotel.fileBase64upload.name;
            fs.writeFileSync(filename, imagess.split(';base64,').pop(), { encoding: 'base64' });
        } else {
            filename = hotel.imagesHotel;
        }
        RoomEntity.findByPk(id).then(async r => {
            if (r) {
                console.log('---------fffffffffffffffffffffffffffff---------', r);
                r['nameHotel'] = hotel.nameHotel,
                    r['roomHotel'] = hotel.roomHotel,
                    r['imagesHotel'] = filename,
                    r['statusHotel'] = hotel.statusHotel,
                    r['locationHotel'] = hotel.locationHotel,
                    r['nearestlocationHotel'] = hotel.nearestlocationHotel,
                    r['priceHotel'] = hotel.priceHotel

                let x = await r.save();
                res.send({ status: 1, data: x });
            } else {
                res.send({ status: 0, data: [], message: 'update failed' });
            }
        })
    }

}
