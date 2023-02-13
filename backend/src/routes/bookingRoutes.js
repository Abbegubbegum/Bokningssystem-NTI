import { Router } from "express";
import { authUser } from "../middleware/auth.js";
import bookingModel from "../models/booking.js";
import roomModel from "../models/room.js";

const router = new Router();

router.post("/", authUser, async (req, res) => {
  if (!req.body.roomNumber) {
    res.status(400).send("No room name provided");
    return;
  }
  if (!req.body.from) {
    res.status(400).send("No start time provided");
    return;
  }
  if (!req.body.to) {
    res.status(400).send("No end time provided");
    return;
  }

  let room = await roomModel.findOne({ roomNumber: req.body.roomNumber });

  if (!room) {
    res.status(400).send("No room with provided name");
    return;
  }

  let bookings = await bookingModel.find({ roomNumber: req.body.roomNumber });

  if (bookings.length != 0) {
    bookings.forEach((booking) => {
      if (
        (booking.start >= req.body.from && booking.start >= req.body.to) ||
        (booking.end <= req.body.from && booking.end <= req.body.to)
      ) {
        bookingModel
          .create({
            booker: req.user._id,
            room: req.body.roomNumber,
            start: Date.parse(req.body.from),
            end: req.body.to,
          })
          .then(() => {
            res.sendStatus(200);
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      } else {
        res.status(400).send("Time already booked!");
        return;
      }
    });
  }
});

export default router;
