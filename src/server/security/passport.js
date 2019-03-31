import passport from "passport";
import Strategy from "passport-local";
import mh from "../../server/api/db";
import { checkLogin } from "./telegram";
import { isNullOrUndefined } from "util";

const expirationTime = 60; // 60 seconds

async function onAuthRequest(req, id, hash, done) {
  try {
    const query = req.query;
    const idUser = +query.id;
    const auth_date = +query.auth_date;
    const check = checkLogin(query);

    if (isNullOrUndefined(check)) {
      return done(null, false);
    }

    const now = Date.now() / 1000;
    if (auth_date + expirationTime < now) {
      return done(null, false);
    }

    const usr = await mh.user.findOne({ _id: idUser });

    if (usr == null) return done(null, false);

    return done(null, { id: usr._id });
  } catch (e) {
    return done(e, false);
  }
}

passport.use(
  new Strategy(
    {
      usernameField: "id",
      passwordField: "hash",
      passReqToCallback: true,
      session: true
    },
    onAuthRequest
  )
);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  done(null, user ? user.id : false);
});

passport.deserializeUser(async (id, done) => {
  const user = await mh.user.findOne({ _id: id });
  done(null, user);
});

export default passport;
