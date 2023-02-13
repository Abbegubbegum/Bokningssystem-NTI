import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
	booker: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	room: {
		type: Schema.Types.ObjectId,
		ref: "Room",
		required: true,
	},
	start: {
		type: Date,
		required: true,
	},
	end: {
		type: Date,
		required: true,
	},
});

export default model("Booking", bookingSchema);
