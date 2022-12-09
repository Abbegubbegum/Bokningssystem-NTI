import { Router } from "express";
import admin from "firebase-admin";

const router = new Router();

router.get("/", (req, res) => {});

router.post("/login", (req, res) => {
	const token = req.body.token || "";

	admin
		.auth()
		.verifyIdToken(token)
		.then((decoded) => {
			const email = decoded.email || "";
			console.log(decoded);
		})
		.catch((err) => {
			console.log(err);
			res.status(401).send("Unauthorized");
		});
});

export default router;
