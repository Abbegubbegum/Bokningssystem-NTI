import { Schema, model } from "mongoose";

const userSchema = new Schema({
	name: String,
	email: {
		type: String,
	},
	firebaseID: {
		type: String,
	},
	admin: {
		type: Boolean,
		default: false,
	},
});

export default model("User", userSchema);
