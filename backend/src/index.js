import express, { json } from "express";
import { resolve } from "path";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import admin from "firebase-admin";
import serviceKey from "./serviceKey.json" assert { type: "json" };

const app = express();
const PORT = process.env.PORT || 3000;

admin.initializeApp({
	credential: admin.credential.cert(serviceKey),
});

app.use(express.static(resolve("../frontend/dist")));
app.use("/api/users", userRoutes);

app.get("/api", (req, res) => {
	console.log("Hello world!");
	res.sendStatus(200);
});

app.listen(PORT, () => {
	// Make mongoose shut up
	mongoose.set("strictQuery", false);
	// Connect the database
	mongoose.connect("mongodb://localhost/bookings");

	console.log("Listening on http://localhost:" + PORT);
});
