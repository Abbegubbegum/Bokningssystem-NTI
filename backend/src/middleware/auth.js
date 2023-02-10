import firebase from "firebase-admin";
import userModel from "../models/user.js";

const emailRegex = /^\S+@ga\.ntig\.se$/g;

const DEVELOPER_MODE = true;

export async function authEmail(req, res, next) {
	let result = await getFirebaseUser(req, res);

	if (!result) {
		return;
	}

	req.user = result;
	next();
}

export async function authUser(req, res, next) {
	let result = await getFirebaseUser(req, res);

	if (!result) {
		return;
	}

	userModel
		.findOne({ firebaseID: result.firebaseID })
		.then((user) => {
			if (!user) {
				return res.status(401).send("User not found");
			}

			req.user = user;

			next();
		})
		.catch((err) => {
			console.err("Database Error:", err);
			return res.sendStatus(500);
		});
}

export async function authAdmin(req, res, next) {
	let result = await getFirebaseUser(req, res);

	if (!result) {
		return;
	}

	userModel
		.findOne({ firebaseID: result.firebaseID })
		.then((user) => {
			if (!user) {
				return res.status(401).send("User not found");
			}

			if (!user.admin) {
				return res.status(403).send("User not authorized");
			}

			req.user = user;

			next();
		})
		.catch((err) => {
			console.err("Database Error:", err);
			return res.sendStatus(500);
		});
}

async function getFirebaseUser(req, res) {
	let token = "";

	if (req.headers.authorization) {
		token = req.headers.authorization.split(" ")[1];
	}

	if (!token) {
		res.status(401).send("Authorization header not included");
		return undefined;
	}

	const decoded = await decodeToken(token);

	if (!decoded) {
		res.sendStatus(401);
		return undefined;
	}

	if (DEVELOPER_MODE) {
		return {
			email: decoded.email,
			name: decoded.name,
			firebaseID: decoded.uid,
		};
	}

	if (!req.user.email.match(emailRegex)) {
		res.sendStatus(403);
		return undefined;
	}

	return {
		email: decoded.email,
		name: decoded.name,
		firebaseID: decoded.uid,
	};
}

async function decodeToken(token) {
	try {
		return await firebase.auth().verifyIdToken(token);
	} catch (err) {
		console.error("User Authentication Error:", err);
		return undefined;
	}
}
