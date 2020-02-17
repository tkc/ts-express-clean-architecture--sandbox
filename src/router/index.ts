import * as express from "express";
import { AuthController } from "../controller";
import { IsLoginMiddleware } from "../middleware";
import * as core from "express-serve-static-core";

const router = express.Router();

export function createRouter(param: { authController: AuthController }): core.Router {
	router.get("/login", param.authController.login);
	router.get("/logout", IsLoginMiddleware(param.authController.logout));
	router.get("/curent_user", IsLoginMiddleware(param.authController.curentUser));
	return router;
}
