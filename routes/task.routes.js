import { Router } from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import BoardModel from "../models/board.model.js";
import ColumnModel from "../models/column.model.js";
import TaskModel from "../models/task.model.js";
import responseResult from "../utils/responseResult.js";
import { taskBodyValidation, taskUpdateBodyValidation } from "../utils/validationSchema.js";

const router = Router();

/**
 * Fetch Data
 */
router.get("/", auth, async (req, res) => {
	const tasks = await TaskModel.find();

	
	if (req.query.name) {
		const task = await TaskModel.findOne({ name: req.query.name });
		if (task) {
			return responseResult(res, {
				code: 200,
				data: task,
			});
		} else {
			return responseResult(res, {
				code: 400,
				message: "Invalid task",
			});
		}
	}

	responseResult(res, {
		code: 200,
		data: tasks,
	});
});

/**
 * Create
 */
router.post("/", auth, async (req, res) => {
	const { error } = taskBodyValidation(req.body);
	if (error) {
		return responseResult(res, {
			code: 400,
			message: error.details[0].message,
		});
	}

	const task = await TaskModel.findOne({ name: req.body.task });
	if (task) {
		return responseResult(res, {
			code: 400,
			message: "Task with given name already exist",
		});
	}

	const board = await BoardModel.findOne({ name: req.body.board });
	if (!board) {
		return responseResult(res, {
			code: 400,
			message: "Board with given name not exist",
		});
	}

	const column = await ColumnModel.findOne({ name: req.body.column, boardId: board._id.toString() });
	if (!column) {
		return responseResult(res, {
			code: 400,
			message: "Column with given name not exist",
		});
	}

	let taskData = {
		boardId: board._id,
		columnId: column._id,
		name: req.body.task,
	};

	await new TaskModel({ ...req.body, ...taskData}).save();

	responseResult(res, {
		code: 201,
		message: "Task created sucessfully",
	});
});

/**
 * Update
 */
router.put("/", auth, async (req, res) => {
	if (!req.body.task) {
		return responseResult(res, {
			code: 400,
			message: "Invalid task name",
		});
	}

	const { error } = taskUpdateBodyValidation(req.body);
	if (error) {
		return responseResult(res, {
			code: 400,
			message: error.details[0].message,
		});
	}

	const task = await TaskModel.findOne({ name: req.query.task });
	if (!task) {
		return responseResult(res, {
			code: 400,
			message: "Task with given name not exist",
		});
	}

	const board = await BoardModel.findOne({ name: req.query.board });
	if (!board) {
		return responseResult(res, {
			code: 400,
			message: "Board with given name not exist",
		});
	}

	const column = await ColumnModel.findOne({ name: req.body.column });
	if (!column) {
		return responseResult(res, {
			code: 400,
			message: "Column with given name not exist",
		});
	}

	const columnData = await ColumnModel.findOne({ name: req.query.column, boardId: board._id.toString() });
	if (!columnData) {
		return responseResult(res, {
			code: 400,
			message: "columnData with given name not exist",
		});
	}

	let taskData = {
		boardId: columnData.boardId,
		columnId: columnData.columnId,
		name: columnData.name,
	};

	let newData = {
		boardId: board._id,
		columnId: column._id,
		name: req.body.task,
	};

	taskData = {
		...taskData,
		...newData,
	};

	const update = await TaskModel.findOneAndUpdate({ name: req.query.task, }, { ...taskData }, {new: true});
	if (!update) {
		return responseResult(res, {
			code: 400,
			message: "Task updated failed",
		});
	}

	responseResult(res, {
		code: 201,
		message: "Task updated sucessfully",
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
	const task = await TaskModel.findOne({ boardId: board._id, name: req.query.task });
	if (task) {
		await task.remove();
		responseResult(res, {
			code: 201,
			message: "Task deleted Sucessfully",
		})
	} else {
		return responseResult(res, {
			code: 400,
			message: "Invalid task name",
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
