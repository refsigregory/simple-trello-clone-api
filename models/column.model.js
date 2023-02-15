import mongoose from "mongoose";

const Schema = mongoose.Schema;

const columnSchema = new Schema({
	boardId: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	position: {
		type: Number,
		required: true,
	},
});

const ColumnModel = mongoose.model("Column", columnSchema);

export default ColumnModel;