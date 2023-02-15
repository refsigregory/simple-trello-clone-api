import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	roles: {
		type: [String],
		enum: ["user", "admin"],
		default: ["user"],
	},
});

const UserModel = mongoose.model("User", userSchema);

export default UserModel;