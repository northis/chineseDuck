import uuid from "uuid/v4";
import session from "express-session";
import { Settings } from "../../../config/common";
export const MongoDBStore = require("connect-mongodb-session")(session);

const sessionItem = session({
  genid: req => {
    return uuid();
  },
  store: new MongoDBStore({
    uri: Settings.mongoDbString,
    autoRemove: "interval",
    collection: "sessions"
  }),
  secret: Settings.sessionsPass,

  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 10 // 10 days
  },
  resave: false,
  saveUninitialized: false,
  rolling: false
});

export default sessionItem;
