import { Booking } from "./booking.model";
import { User } from "./user.model";
import { WorkshopEvent } from "./workshop-event.model";

export class BookingWithEvent {
    booking: Booking;
    workshopEvent: WorkshopEvent;
    user:User;
  }
  