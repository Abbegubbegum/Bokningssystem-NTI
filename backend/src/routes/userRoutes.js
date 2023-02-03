import { Router } from "express";
import { authAdmin, authEmail, authUser } from "../middleware/auth.js";
import userModel from "../models/user.js";

const router = new Router();

router.get("/", authAdmin, (req, res) => {});

router.post("/", authEmail, (req, res) => {
	userModel.create(req.user).then((result) => {
		
	})

});

export default router;
