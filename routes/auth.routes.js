import { Router } from "express";
import User from "../models/user.model.js";
import UserToken from "../models/userToken.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import generateTokens from "../utils/generateTokens.js";
import { refreshTokenBodyValidation } from "../utils/validationSchema.js";
import verifyRefreshToken from "../utils/verifyRefreshToken.js";
import {
	signUpBodyValidation,
	logInBodyValidation,
} from "../utils/validationSchema.js";
import getEpochNow from "../utils/getEpochNow.js";
import responseResult from "../utils/responseResult.js";

const router = Router();
const MAX_SESSION_PER_USER = 1;

// signup
router.post("/register", async (req, res) => {
	try {
		const { error } = signUpBodyValidation(req.body);
		if (error)
			return responseResult(res, {
				code: 400,
				message: error.details[0].message,
			});

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return responseResult(res, {
				code: 400,
				message: "User with given email already exist",
			});

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();

		responseResult(res, {
			code: 201,
			message: "Account created sucessfully",
		});
	} catch (err) {
		console.log(err);
		responseResult(res, {
			code: 500,
			message: "Internal Server Error",
		});
	}
});

// login
router.post("/login", async (req, res) => {
	try {
		const { error } = logInBodyValidation(req.body);
		if (error)
			return responseResult(res, {
				code: 400,
				message: error.details[0].message,
			});

		let param;
		if (req.body.email) {
			param = {
				email: req.body.email
			}
		} else if (req.body.username) {
			param = {
				username: req.body.username
			}
		} else {
			return responseResult(res, {
				code: 400,
				message: "Please enter valid email or username",
			});
		}

		const user = await User.findOne(param);

		if (!user)
			return responseResult(res, {
				code: 400,
				message: "Invalid email or password",
			});

		const usersToken = await UserToken.find({ userId: user._id });
		
		/**
		 * Check if the user has another session
		 */
		if (usersToken) {
			if (usersToken.length >= MAX_SESSION_PER_USER) {
				for (const userToken of usersToken) {
					try {
						let detailToken
						jwt.verify(
							userToken.token,
							process.env.ACCESS_TOKEN_PRIVATE_KEY
						, (err, decoded) => {
							detailToken = decoded
						});
						if (detailToken) {
							if (detailToken.exp > getEpochNow()) {
								return responseResult(res, {
									code: 401,
									message: "Session already exists",
								});
								break;
							}
						}
					} catch (error) {
						console.log(error);
						break;
					}
				}
			}
		}

		const verifiedPassword = await bcrypt.compare(
			req.body.password,
			user.password,
		);
		if (!verifiedPassword)
			return responseResult(res, {
				code: 400,
				message: "Invalid email or password",
			});

		const { accessToken, refreshToken } = await generateTokens(user);

		responseResult(res, {
			code: 200,
			data: {
				accessToken,
				refreshToken,
			},
			message: "Logged in sucessfully",
		})
	} catch (err) {
		console.log(err);
		responseResult(res, {
			code: 500,
			message: "Internal Server Error",
		});
	}
});

router.get("/refresh", async (req, res) => {
	const { error } = refreshTokenBodyValidation(req.query);
	if (error)
		return responseResult(res, {
			code: 400,
			message: error.details[0].message,
		})
	verifyRefreshToken(req.query.refreshToken)
		.then(({ tokenDetails }) => {
			const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
			const accessToken = jwt.sign(
				payload,
				process.env.ACCESS_TOKEN_PRIVATE_KEY,
				{ expiresIn: "14m" }
			);
			responseResult(res, {
				code: 200,
				data: {
					accessToken,
				},
				message: "Access token created successfully",
			})
		})
		.catch((err) => res.status(400).json(err));
});

// logout
router.post("/logout", async (req, res) => {
	try {
		const { error } = refreshTokenBodyValidation(req.body);
		if (error)
			return responseResult(res, {
				code: 400,
				message: error.details[0].message,
			})
		const userToken = await UserToken.findOne({ token: req.body.refreshToken });
		if (!userToken)
			return responseResult(res, {
				code: 200,
				message: "Logged Out Sucessfully",
			})

		await userToken.remove();
		responseResult(res, {
			code: 200,
			message: "Logged Out Sucessfully",
		})
	} catch (err) {
		console.log(err);
		responseResult(res, {
			code: 200,
			message: "Internal Server Error",
		})
	}
});

export default router;
