import { Router } from "express";
import auth from "../middleware/auth.js";
import responseResult from "../utils/responseResult.js";

const router = Router();

router.get("/details", auth, (req, res) => {
	responseResult(res, {
		code: 200,
		message: "user authenticated.",
	});
});

export default router;
