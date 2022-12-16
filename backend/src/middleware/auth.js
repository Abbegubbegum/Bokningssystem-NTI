import admin from "firebase-admin";

async function authUser(req, res, next) {
	const token = req.headers.authorization.split(" ")[1];

	if (!token) {
		return res.status(401).send("Authorization header not included");
	}

	const decoded = await admin
		.auth()
		.verifyIdToken(token)
		.catch((err) => {
			console.error("User Authentication Error:", err);
			return res.status(401).send("Unauthorized");
		});

	req.user = {
		email: decoded.email,
		name: decoded.name,
		firebaseID: decoded.uid,
	};

	next();
}

function authAdmin(req, res, next) {}

export default { authUser, authAdmin };
