import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import api from "./api";
//import * as errors from './errors';
import helmet from "helmet";
import compression from "compression";
import httpErrorPages from "http-error-pages";
import { getFooterMarkupLine } from "../../config/common.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./api/swagger.json";
import passport from "./security/passport";
import sessionItem from "./security/session";
import { Settings, isDebug } from "../../config/common";
import { GracefulShutdownManager } from "@moebius/http-graceful-shutdown";

const app = express();

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render("error", {
    message: err.message,
    error: isDebug() ? err : {}
  });
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());

app.use(sessionItem);
app.use(passport.initialize());
app.use(passport.session());

app.use(Settings.docsPrefix, swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(Settings.apiPrefix, api);
app.use(express.static(path.join(__dirname, "/public")));

app.get(/^\/unsupported/, function(request, response) {
  response.sendFile(path.resolve(__dirname, "public/unsupported.html"));
});

app.get(/^\/client/, function(request, response) {
  response.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.get("/", function(request, response) {
  response.redirect("/client");
});

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
app.use(logErrors);

httpErrorPages.express(app, {
  lang: "en_US",
  footer: getFooterMarkupLine()
});

const listen = app.listen(Settings.port, () => {
  console.info(`The server is running at http://localhost:${Settings.port}/`);
});

const shutdownManager = new GracefulShutdownManager(listen);
const shutDown = async () => {
  shutdownManager.terminate(() => {
    console.info("Server is gracefully terminated");
    Promise.resolve();
  });
};

const shutDownEnabled = "shutDownEnabled";
if (process.argv.find(a => a == shutDownEnabled) == undefined) {
  process.on("SIGTERM", shutDown);
  process.argv.push(shutDownEnabled);
}
// Hot Module Replacement
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept("./api");
}

export default { app, listen, shutDown };
