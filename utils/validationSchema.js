import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const signUpBodyValidation = (body) => {
	const schema = Joi.object({
		username: Joi.string().required().label("User Name"),
		email: Joi.string().email().required().label("Email"),
		password: passwordComplexity().required().label("Password"),
		firstName: Joi.string().required().label("First Name"),
		lastName: Joi.string().required().label("Last Name"),
	});
	return schema.validate(body);
};

const logInBodyValidation = (body) => {
	const schema = Joi.object({
		username: Joi.string().label("User Name"),
		email: Joi.string().email().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(body);
};

const refreshTokenBodyValidation = (body) => {
	const schema = Joi.object({
		refreshToken: Joi.string().required().label("Refresh Token"),
	});
	return schema.validate(body);
};

const boardBodyValidation = (body) => {
	const schema = Joi.object({
		name: Joi.string().required().label("Board Name"),
		description: Joi.string().required().label("Board Description"),
	});
	return schema.validate(body);
};

const boardShareBodyValidation = (body) => {
	const schema = Joi.object({
		username: Joi.string().label("User Name"),
		role: Joi.string().allow("admin", "guest").default("guest"),
	});
	return schema.validate(body);
};

const columnBodyValidation = (body) => {
	const schema = Joi.object({
		board: Joi.string().required().label("Board Name"),
		column: Joi.string().required().label("Column Name"),
		position: Joi.number().label("Position"),
	});
	return schema.validate(body);
};

const columnUpdateBodyValidation = (body) => {
	const schema = Joi.object({
		column: Joi.string().required().label("Column Name"),
		position: Joi.number().required().label("Position"),
	});
	return schema.validate(body);
};

const taskBodyValidation = (body) => {
	const schema = Joi.object({
		board: Joi.string().required().label("Board Name"),
		column: Joi.string().required().label("Column Name"),
		task: Joi.string().required().label("Column Name"),
	});
	return schema.validate(body);
};

const taskUpdateBodyValidation = (body) => {
	const schema = Joi.object({
		column: Joi.string().required().label("Column Name"),
		task: Joi.string().required().label("Column Name"),
	});
	return schema.validate(body);
};



export {
	signUpBodyValidation,
	logInBodyValidation,
	refreshTokenBodyValidation,
	boardBodyValidation,
	boardShareBodyValidation,
	columnBodyValidation,
	columnUpdateBodyValidation,
	taskBodyValidation,
	taskUpdateBodyValidation,
};
