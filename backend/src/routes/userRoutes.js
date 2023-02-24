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

router.put("/", authAdmin, async (req, res) => {
  if (!req.body.id) {
    console.log("No id provided");
    res.sendStatus(400);
    return;
  }
  console.log(req.body);
  if (!req.body.name) {
    console.log("No name provided");
    res.sendStatus(400);
    return;
  }
  let err = "";
  userModel
    .findByIdAndUpdate(req.body.id, {
      name: req.body.name,
      admin: req.body.admin,
    })
    .error((e) => {
      err = e;
    });

  if (err) {
    res.status(400).send(err);
    return;
  }
  res.sendStatus(200);
});

export default router;
