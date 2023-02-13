import { Router } from "express";
import { authAdmin, authUser } from "../middleware/auth.js";
import bookingModel from "../models/booking.js";
import roomModel from "../models/room.js";

const router = new Router();

router.delete("/", authUser, async (req, res) => {
  let id = req.body.id;
  if (!id) {
    res.status(400).send("No room id provided");
    return;
  }

  console.log(id);

  let booking = await bookingModel.findOne({ _id: id });

  if (!booking) {
    res.status(400).send("No booking with provided id");
    return;
  }

  console.log(booking.booker);

  if (req.user._id.equals(booking.booker)) {
    try {
      await booking.remove();
    } catch (err) {
      res.status(400).send(err);
      return;
    }
    res.sendStatus(200);
    return;
  } else if (req.user.admin) {
    
    try {
      await booking.remove();
    } catch (err) {
      res.status(400).send(err);
      return;
    }
    res.sendStatus(200);
    return;
  }
  res.status(401).send("You don't have access");
  return;
});

router.post("/", authUser, async (req, res) => {
  const fromTime = Date.parse(req.body.from);
  const toTime = Date.parse(req.body.to);

  if (!req.body.room) {
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

  let room = await roomModel.findOne({ roomNumber: req.body.room });

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
