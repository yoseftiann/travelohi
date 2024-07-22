import { IHotel } from "./hotel";

export interface IRoom {
    ID: string;
    Capacity: number;
    Image : string;
    Type: string;
    Price: string;
    HotelID : string;
    Hotel: IHotel;
}