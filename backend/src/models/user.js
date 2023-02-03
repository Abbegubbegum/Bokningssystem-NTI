import { Schema, model } from "mongoose";

const userSchema = new Schema({
	name: String,
	email: {
		type: String,
	},
	firebaseID: {
		type: String,
		unique: true,
		required: true
	},
	admin: {
		type: Boolean,
		default: false,
	},
});

export default model("User", userSchema);
