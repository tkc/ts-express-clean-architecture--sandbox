import * as express from "express";
import * as models from "../models";

export class SessionHelper {
	public setAuthUser(req: express.Request, user: models.User): void {
		req.session.user = { _id: user._id, name: user.name };
	}
	public destroy(req: express.Request): void {
		req.session.destroy((err: any) => console.log(err));
	}
	public currentUser(req: express.Request): models.User {
		return req.session.user;
	}
}
