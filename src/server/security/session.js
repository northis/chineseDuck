import uuid from "uuid/v4";
import session from "express-session";
import { Settings } from "../../../config/common";
export const MongoDBStore = require("connect-mongodb-session")(session);

const sessionItem = session({
  genid: req => {
    console.info(`Request object sessionID from client: ${req.sessionID}`);
    return uuid();
  },
  store: new MongoDBStore({
    uri: Settings.mongoDbString,
    collection: "sessions"
  }),
  secret: Settings.sessionsPass,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 90 // 90 days
  },
  resave: true,
  saveUninitialized: true,
  rolling: true
});

export default sessionItem;
