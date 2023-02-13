import { Schema, model } from "mongoose";

const roomSchema = new Schema({
	roomNumber: {
		type: String,
		required: true,
		unique: true,
	},
});

export default model("Room", roomSchema);
