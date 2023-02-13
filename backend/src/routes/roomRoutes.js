import { Router } from "express";
import { authAdmin, authUser } from "../middleware/auth.js";
import roomModel from "../models/room.js";

const router = new Router();

router.get("/", authUser, async (req, res) => {
  let rooms = await roomModel.find({});
  res.status(200).send(rooms);
});

router.post("/", authAdmin, async (req, res) => {
  let roomNumber = req.body.roomNumber;
  if (!roomNumber) {
    res.status(400).send("No room name provided");
    return;
  }

  try {
    await roomModel.create({
      roomNumber: roomNumber,
    });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).send("A room with that name already exists");
      return;
    }
    res.status(400).send(err);
    return;
  }

  res.sendStatus(200);
});

router.delete("/", authAdmin, async (req, res) => {
  let roomNumber = req.body.roomNumber;
  if (!roomNumber) {
    res.status(400).send("No room name provided");
  }
  try {
    await roomModel.deleteOne({ roomNumber: roomNumber });
  } catch (err) {
    res.status(400).send(err);
    return;
  }
  res.sendStatus(200);
  return;
});

export default router;
