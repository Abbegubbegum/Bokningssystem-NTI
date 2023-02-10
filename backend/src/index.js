import express, { json } from "express";
import { resolve } from "path";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import admin from "firebase-admin";
import serviceKey from "./serviceKey.json" assert { type: "json" };
import cors from "cors";
import { config } from "dotenv";
import roomModel from "./models/room.js";
import bookingModel from "./models/booking.js";
import { authUser } from "./middleware/auth.js";

config();

const app = express();
const PORT = parseInt(process.env.PORT) || 3000;

const DB_URI = process.env.DB_URI || "mongodb://localhost/bookings";

admin.initializeApp({
  credential: admin.credential.cert(serviceKey),
});

app.use(cors());
app.use(express.json());
app.use(express.static(resolve("../frontend/dist")));
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/rooms", roomRouter);

app.get("/api/availability", authUser, async (req, res) => {
  let startTime = req.query.from;
  let endTime = req.query.to;

  if (
    !startTime &&
    typeof startTime !== "string" &&
    !endTime &&
    typeof endTime !== "string"
  ) {
    res.sendStatus(400);
  }

  let startDate = Date.parse(startTime);
  let endDate = Date.parse(endTime);

  let bookings = await bookingModel.find({}).populate("room");
  let rooms = await roomModel.find({});
  let response = [];
  rooms.forEach((room) => {
    let indRoom = {
      room: room.roomNumber,
      bookings: [],
    };
    bookings.forEach((booking) => {
      if (booking.room.roomNumber != room.roomNumber) {
        return;
      }

      //Checks if booking is within selected timeframe
      if (
        (booking.startTime < endDate && endDate > booking.endTime) ||
        (booking.startTime < startDate && startDate > booking.endTime) ||
        (startDate < booking.endTime && booking.endTime > endDate) ||
        (endDate < booking.endTime && startDate > booking.startTime)
      ) {
        indRoom.bookings.add(booking);
      }
    });
    response.add(indRoom);
  });

  res.status(200).send(response);
});

app.get("/api", (req, res) => {
  res.sendStatus(200);
});

app.listen(PORT, async () => {
  console.log("Connecting to database...");
  // Make mongoose shut up
  mongoose.set("strictQuery", false);
  // Connect the database
  await mongoose.connect(DB_URI);

  console.log("Connected to database!");
  console.log("Listening on http://localhost:" + PORT);
});
