import express, { json } from "express";
import { resolve } from "path";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import admin from "firebase-admin";
import serviceKey from "./serviceKey.json" assert { type: "json" };
import cors from "cors";
import { config } from "dotenv"

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
