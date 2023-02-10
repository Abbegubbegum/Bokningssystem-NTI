import { Router } from "express";
import { authAdmin, authEmail, authUser } from "../middleware/auth.js";
import userModel from "../models/user.js";

const router = new Router();

router.get("/", authAdmin, (req, res) => {});

router.post("/login", authEmail, async (req, res) => {
  try {
    const findResult = await userModel.find({
      firebaseID: req.user.firebaseID,
    });
    if (findResult) {
      return res.status(200).json(findResult);
    }
  } catch {
    return res.sendStatus(500);
  }

  userModel
    .create(req.user)
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.get("/:slug/thing", (req, res) => {
  req.params;
});

export default router;
