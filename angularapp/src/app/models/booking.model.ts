import { User } from "./user.model";
import { WorkshopEvent } from "./workshop-event.model";

export interface Booking{
    BookingId:number;
    UserId:number;
    WorkshopEventId:number;
    BookingStatus:string;
    BookingDate:Date;
    Gender:string;
    Age:number;
    Occupation:string;
    City:string;
    Proof:string;
    AdditionalNotes?:string;
   
}