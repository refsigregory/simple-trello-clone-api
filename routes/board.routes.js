import { Router } from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import BoardModel from "../models/board.model.js";
import User from "../models/user.model.js";
import responseResult from "../utils/responseResult.js";
import { boardBodyValidation, boardShareBodyValidation } from "../utils/validationSchema.js";

const router = Router();

/**
 * Fetch Data
 */
router.get("/", auth, async (req, res) => {
	const boards = await BoardModel.find();

	
	if (req.query.name) {
		const board = await BoardModel.findOne({ name: req.query.name });
		if (board) {
			return responseResult(res, {
				code: 200,
				data: board,
			});
		} else {
			return responseResult(res, {
				code: 400,
				message: "Invalid board",
			});
		}
	}

	responseResult(res, {
		code: 200,
		data: boards,
	});
});

/**
 * Create
 */
router.post("/", auth, async (req, res) => {
	const { error } = boardBodyValidation(req.body);
	if (error)
		return responseResult(res, {
			code: 400,
			message: error.details[0].message,
		});

	const board = await BoardModel.findOne({ name: req.body.name });
	if (board)
		return responseResult(res, {
			code: 400,
			message: "Board with given name already exist",
		});

	let boardData = {
		users: [
			{
				"userId": req.user._id,
				"role": "admin"
			}
		]
	};

	await new BoardModel({ ...req.body, ...boardData}).save();

	responseResult(res, {
		code: 201,
		message: "Board created sucessfully",
	});
});

/**
 * Update
 */
router.put("/", auth, async (req, res) => {
	if (!req.query.name) {
		return responseResult(res, {
			code: 400,
			message: "Invalid board name",
		});
	}

	const { error } = boardBodyValidation(req.body);
	if (error) {
		return responseResult(res, {
			code: 400,
			message: error.details[0].message,
		});
	}

	const board = await BoardModel.findOne({ name: req.query.name });
	if (!board)
		return responseResult(res, {
			code: 400,
			message: "Board with given name not exist",
		});
	
	let boardData = {
		name: board.name,
		description: board.description,
		users: board.users,
	}

	boardData = {
		...boardData,
		...req.body,
	}

	const update = await BoardModel.findOneAndUpdate({ name: req.query.name, }, { ...boardData }, {new: true});
	if (!update)
		return responseResult(res, {
			code: 400,
			message: "Board updated failed",
		});

	responseResult(res, {
		code: 201,
		message: "Board updated sucessfully",
	});
});

/**
 * Share Board
 */
 router.post("/share", auth, async (req, res) => {
	if (!req.query.name) {
		return responseResult(res, {
			code: 400,
			message: "Invalid board name",
		});
	}

	const { error } = boardShareBodyValidation(req.body);
	if (error) {
		return responseResult(res, {
			code: 400,
			message: error.details[0].message,
		});
	}
	const { username, role } = req.body;

	const board = await BoardModel.findOne({ name: req.query.name });
	if (!board)
		return responseResult(res, {
			code: 400,
			message: "Board with given name not exist",
		});
	
	let boardData = {
		name: board.name,
		description: board.description,
		users: board.users,
	}

	const user = await User.findOne({ username: username });
		if (!user) {
			return responseResult(res, {
				code: 400,
				message: "User with given username not exist",
			});
		}
	const userId = user._id.toString();
	for (const userList of boardData.users) {
		if (userList.userId === userId) {
			return responseResult(res, {
				code: 400,
				message: "User with given username already exist",
			});
		}
	}

	console.log(boardData.users);

	const newUser = {
		"userId": userId,
		"role": role
	}

	boardData = {
		...boardData,
		users: [
			...boardData.users,
			newUser
		]
	}

	const update = await BoardModel.findOneAndUpdate({ name: req.query.name, }, { ...boardData }, {new: true});
	if (!update)
		return responseResult(res, {
			code: 400,
			message: "Board share failed",
		});

	responseResult(res, {
		code: 201,
		message: "Board share sucessfully",
	});
});

/**
 * Delete
 */
router.delete("/", async (req, res) => {
	try {
	const board = await BoardModel.findOne({ name: req.query.name });
	if (board) {
		await board.remove();
		responseResult(res, {
			code: 201,
			message: "Board deleted Sucessfully",
		})
	} else {
		return responseResult(res, {
			code: 400,
			message: "Invalid board name",
		});
	}

	} catch (err) {
		console.log(err);
		responseResult(res, {
			code: 500,
			message: "Internal Server Error",
		})
	}
});


export default router;
