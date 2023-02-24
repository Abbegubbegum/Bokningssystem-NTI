import { Router } from "express";
import { authAdmin, authUser } from "../middleware/auth.js";
import bookingModel from "../models/booking.js";
import roomModel from "../models/room.js";

const router = new Router();

router.get("/:roomNumber", authUser, async (req, res) => {
	let roomNumber = req.params.roomNumber;

	if (!roomNumber) {
		res.status(400).send("No room number provided");
	}

	let room = await roomModel.findOne({ roomNumber: roomNumber });

	let bookings = await bookingModel
		.find({
			room: room._id,
			end: { $gte: new Date() },
		})
		.sort({ start: "asc" })
		.populate("booker");

	res.status(200).send(bookings);
});

router.delete("/", authUser, async (req, res) => {
	let id = req.body.id;
	if (!id) {
		res.status(400).send("No room id provided");
		return;
	}

	let booking = await bookingModel.findOne({ _id: id });

	if (!booking) {
		res.status(400).send("No booking with provided id");
		return;
	}

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
	const startTime = Date.parse(req.body.from);
	const endTime = Date.parse(req.body.to);

	if (!req.body.room) {
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

	if (endTime <= startTime) {
		res.status(400).send("Start time not before end time");
		return;
	}

	if (endTime < new Date().getTime()) {
		res.status(400).send("End time is in the past");
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
			const bookingStartUnix = booking.start.getTime();
			const bookingEndUnix = booking.end.getTime();

			//Checks if booking is within selected timeframe
			if (
				(bookingStartUnix < endTime && endTime < bookingEndUnix) ||
				(bookingStartUnix < startTime && startTime < bookingEndUnix) ||
				(startTime < bookingEndUnix && bookingEndUnix < endTime) ||
				(startTime < bookingStartUnix && bookingStartUnix < endTime) ||
				(bookingStartUnix === startTime && bookingEndUnix === endTime)
			) {
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
			start: startTime,
			end: endTime,
		})
		.then(() => {
			res.sendStatus(200);
		})
		.catch((err) => {
			res.status(400).send(err);
		});
});

export default router;
