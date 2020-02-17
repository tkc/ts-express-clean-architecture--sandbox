import * as express from "express";
import * as types from "../types";
import { SessionHelper } from "../helper";

export class AuthController {
	sessionHelper: SessionHelper;
	constructor(sessionHelper: SessionHelper) {
		this.sessionHelper = sessionHelper;
	}
	public login(req: express.Request, res: express.Response) {
		this.sessionHelper.setAuthUser(req, { _id: "dummyId", name: "dummyName" });
		const response: types.AuthLoginResponse = req.session.user;
		res.status(200).send(response);
	}
	public logout(req: express.Request, res: express.Response) {
		this.sessionHelper.destroy(req);
		res.status(200).send("");
	}
	public curentUser(req: express.Request, res: express.Response) {
		const response: types.AuthCurentUserResponse = this.sessionHelper.currentUser(req);
		res.status(200).send(response);
	}
}
