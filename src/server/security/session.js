import uuid from "uuid/v4";
import session from "express-session";
const FileStore = require("session-file-store")(session);

const sessionItem = session({
  genid: req => {
    console.info(`Request object sessionID from client: ${req.sessionID}`);
    return uuid();
  },
  store: new FileStore(),
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true
});

export default sessionItem;
