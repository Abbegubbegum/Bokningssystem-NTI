import { Router } from "express";
import { authUser } from "../middleware/auth.js";
import roomModel from "../models/room.js";

const router = new Router();

router.get("/", authUser, async (req, res) => {
  let rooms = await roomModel.find({});
  res.status(200).send(rooms);
});

export default router;
