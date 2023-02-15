import mongoose from "mongoose";

const Schema = mongoose.Schema;

const boardSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	users: {
		type: Array,
		required: true,
	},
});

const BoardModel = mongoose.model("Board", boardSchema);

export default BoardModel;