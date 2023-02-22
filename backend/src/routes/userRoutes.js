import { Router } from "express";
import { authAdmin, authEmail, authUser } from "../middleware/auth.js";
import userModel from "../models/user.js";

const router = new Router();

router.get("/", authAdmin, (req, res) => {
  userModel
    .find({})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.post("/login", authEmail, async (req, res) => {
  try {
    const findResult = await userModel.findOne({
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

export default router;
