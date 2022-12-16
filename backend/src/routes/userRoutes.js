import { Router } from "express";
import admin from "firebase-admin";
import auth from "../middleware/auth.js";

const router = new Router();

router.get("/", auth.authAdmin, (req, res) => {});

router.post("/", auth.authUser, (req, res) => {
	console.log(req.user);
});

export default router;
