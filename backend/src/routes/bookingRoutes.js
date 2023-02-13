import { Router } from "express";
import { authUser } from "../middleware/auth.js";
import bookingModel from "../models/booking.js";
import roomModel from "../models/room.js";

const router = new Router();

router.post("/", authUser, async (req, res) => {
  const fromTime = Date.parse(req.body.from);
  const toTime = Date.parse(req.body.to);

  if (!req.body.roomNumber) {
    res.status(400).send("No room name provided");
    return;
  }
  if (!fromTime) {
    res.status(400).send("No start time provided");
    return;
  }
  if (!toTime) {
    res.status(400).send("No end time provided");
    return;
  }

  if (toTime <= fromTime) {
    res.status(400).send("Start time not before end time");
    return;
  }

  let room = await roomModel.findOne({ roomNumber: req.body.roomNumber });

  if (!room) {
    res.status(400).send("No room with provided name");
    return;
  }

  let bookings = await bookingModel.find({
    room: room._id,
  });

  let err = false;
  if (bookings.length != 0) {
    bookings.forEach((booking) => {
      if (booking.start < toTime || booking.end > fromTime) {
        err = true;
      }
    });
  }
  if (err) {
    res.status(400).send("Time already booked!");
    return;
  }
  bookingModel
    .create({
      booker: req.user._id,
      room: room._id,
      start: fromTime,
      end: toTime,
    })
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

export default router;
function newFunction(req) {
  return fromTime;
}
