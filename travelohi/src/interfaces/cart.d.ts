import { IRoom } from "./room";

export interface IRoomCart {
    ID: string;
    Quantity: number;
    Room: IRoom;
    CheckInDate: Date | string;
    CheckOutDate: Date | string;
}