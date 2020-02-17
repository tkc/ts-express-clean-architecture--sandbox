import * as express from "express";

export const IsLoginMiddleware = fn => (req: express.Request, res: express.Response, next: express.NextFunction) => {
	if (!req.session.user) {
		res.status(401).send("no auth");
	}
	return fn(req, res, next);
};
