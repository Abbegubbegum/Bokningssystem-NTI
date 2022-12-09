import express from "express";
import { resolve } from "path";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(resolve("../frontend/dist")));

app.get("/api", (req, res) => {
	console.log("Hello world!");
	res.sendStatus(200);
});

app.listen(PORT, () => {
	console.log("Listening on http://localhost:" + PORT);
});
