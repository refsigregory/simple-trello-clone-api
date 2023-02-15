import { Router } from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import BoardModel from "../models/board.model.js";
import ColumnModel from "../models/column.model.js";
import User from "../models/user.model.js";
import responseResult from "../utils/responseResult.js";
import { columnBodyValidation, columnUpdateBodyValidation } from "../utils/validationSchema.js";

const router = Router();

/**
 * Fetch Data
 */
router.get("/", auth, async (req, res) => {
	const columns = await ColumnModel.find();

	
	if (req.query.name) {
		const column = await ColumnModel.findOne({ name: req.query.name });
		if (column) {
			return responseResult(res, {
				code: 200,
				data: column,
			});
		} else {
			return responseResult(res, {
				code: 400,
				message: "Invalid column",
			});
		}
	}

	responseResult(res, {
		code: 200,
		data: columns,
	});
});

/**
 * Create
 */
router.post("/", auth, async (req, res) => {
	const { error } = columnBodyValidation(req.body);
	if (error) {
		return responseResult(res, {
			code: 400,
			message: error.details[0].message,
		});
	}

	const column = await ColumnModel.findOne({ name: req.body.column });
	if (column) {
		return responseResult(res, {
			code: 400,
			message: "Column with given name already exist",
		});
	}

	const board = await BoardModel.findOne({ name: req.body.board });
	if (!board) {
		return responseResult(res, {
			code: 400,
			message: "Board with given name not exist",
		});
	}

	let columnData = {
		boardId: board._id,
		name: req.body.column,
		position: 0,
	};

	if (req.body.position) {
		columnData.position = req.body.position;
	} else {
		const sortColumn = await ColumnModel.find({ boardId: board._id.toString() }).sort({position: 'desc' });
		const lastPosition = sortColumn.length > 0 ? sortColumn[0].position : 0;
		columnData.position = lastPosition + 1;
	}

	await new ColumnModel({ ...req.body, ...columnData}).save();

	responseResult(res, {
		code: 201,
		message: "Column created sucessfully",
	});
});

/**
 * Update
 */
router.put("/", auth, async (req, res) => {
	if (!req.query.column) {
		return responseResult(res, {
			code: 400,
			message: "Invalid column name",
		});
	}

	if (!req.body.position) {
		return responseResult(res, {
			code: 400,
			message: "Invalid position",
		});
	}

	const { error } = columnUpdateBodyValidation(req.body);
	if (error) {
		return responseResult(res, {
			code: 400,
			message: error.details[0].message,
		});
	}

	const board = await BoardModel.findOne({ name: req.query.board });
	if (!board) {
		return responseResult(res, {
			code: 400,
			message: "Board with given name not exist",
		});
	}


	const column = await ColumnModel.findOne({ name: req.query.column, boardId: board._id.toString() });
	if (!column) {
		return responseResult(res, {
			code: 400,
			message: "Column with given name not exist",
		});
	}


	// Reposition Column
	const columns = await ColumnModel.find({ boardId: board._id.toString() });
	if (columns) {
		let pos = 1;
		for (const colData of columns) {
			if (req.body.column !== colData.name) {
				if (req.body.position === pos) {
					console.log(`(${pos})`)
					pos = pos + 1;
				}
				await ColumnModel.findOneAndUpdate({ name: colData.name, boardId: colData.boardId }, {
					boardId: colData.boardId,
					name: colData.name,
					position: pos,
				}, {new: true});

				console.log(pos)

				pos = pos + 1;
			}
		}
	}

	let columnData = {
		boardId: column.boardId,
		name: column.name,
		position: column.position,
	};
	let newColumnData = {
		name: req.body.column,
		position: req.body.position,
	};

	columnData = {
		...columnData,
		...newColumnData,
	};

	const update = await ColumnModel.findOneAndUpdate({ name: req.query.column, }, { ...columnData }, {new: true});
	if (!update) {
		return responseResult(res, {
			code: 400,
			message: "Column updated failed",
		});
	}

	responseResult(res, {
		code: 201,
		message: "Column updated sucessfully",
	});
});

/**
 * Delete
 */
router.delete("/", async (req, res) => {
	const board = await BoardModel.findOne({ name: req.query.board });
	if (!board)
		return responseResult(res, {
			code: 400,
			message: "Board with given name not exist",
		});

	try {
	const column = await ColumnModel.findOne({ boardId: board._id, name: req.query.column });
	if (column) {
		await column.remove();
		responseResult(res, {
			code: 201,
			message: "Column deleted Sucessfully",
		})
	} else {
		return responseResult(res, {
			code: 400,
			message: "Invalid column name",
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
