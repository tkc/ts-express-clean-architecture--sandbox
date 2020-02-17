import * as express from "express";
import * as bodyParser from "body-parser";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
import * as dotenv from "dotenv";
import * as csrf from "csurf";
import * as compression from "compression";
import * as log4js from "log4js";
import { Server } from "http";
import { createRouter } from "./router";
import * as controller from "./controller";
import * as helper from "../src/helper";

const sessionHelper = new helper.SessionHelper();
const authController = new controller.AuthController(sessionHelper);
const router = createRouter({ authController });

const sessionSetting = session({
	secret: process.env.SALT,
	resave: true,
	saveUninitialized: false,
	cookie: { secure: process.env.WEB_PROTOCOL === "https", maxAge: 30 * 60 * 1000 }
});

const log4jsConfig = {
	appenders: {
		system: { type: "dateFile", filename: "./log/system.log", pattern: ".yyyy-MM-dd", compress: true },
		error: { type: "dateFile", filename: "./log/error.log", pattern: ".yyyy-MM-dd", compress: true },
		info: { type: "dateFile", filename: "./log/info.log", pattern: ".yyyy-MM-dd", compress: true }
	},
	categories: {
		default: { appenders: ["system"], level: "info" },
		error: { appenders: ["error"], level: "error" },
		info: { appenders: ["info"], level: "info" }
	}
};

const initServer = async (): Promise<void> => {
	const app = express();
	dotenv.config();
	log4js.configure(log4jsConfig);
	app.use(router);
	app.use(compression({ threshold: 0, level: 9, memLevel: 9 }));
	app.use(express.static(path.resolve("./public")));
	app.set("trust proxy", 1);
	app.use(cookieParser());
	app.use(sessionSetting);
	app.use(bodyParser.json({ limit: "50mb" }));
	app.use(bodyParser.urlencoded({ extended: true, limit: "50mb", parameterLimit: 1000000 }));
	app.use(csrf());
	app.use((req, res, next) => {
		res.header("Cache-Control", ["private", "no-store", "no-cache"].join(","));
		next();
	});
	const port = process.env.NODE_ENV === "developing" ? 5555 : 3333;
	const server: Server = app.listen(port);
	server.timeout = 3600 * 1000;
	console.log(`[mode:${process.env.NODE_ENV}]Express server has started on port ${port} !!`);
};

initServer();
