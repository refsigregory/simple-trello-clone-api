import mongoose from "mongoose";

const Schema = mongoose.Schema;

const taskSchema = new Schema({
	boardId: {
		type: String,
		required: true,
	},
	columnId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
});

const TaskModel = mongoose.model("Task", taskSchema);

export default TaskModel;