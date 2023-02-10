import { Schema, model, Mongoose } from "mongoose";

const bookingSchema = new Schema({
  booker: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
  start: Date,
  end: Date,
});

export default model("Booking", bookingSchema);
