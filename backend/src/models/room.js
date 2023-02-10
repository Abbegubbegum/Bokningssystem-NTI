import { Schema, model } from "mongoose";

const roomSchema = new Schema({
  roomNumber: String,
});

export default model("Room", roomSchema);
