import passport from "passport";
import Strategy from "passport-local";
import { signIn } from "../../server/services/telegram";
import mh from "../../server/api/db";
const bcrypt = require("bcrypt");

async function onAuthRequest(req, id, code, done) {
  let usr = undefined;
  const idInt = id.startsWith("+") ? NaN : +id;
  if (isNaN(idInt)) {
    try {
      const hashPhone = req.body.hash;
      let usrResp = await signIn(id, code, hashPhone);

      usr = await mh.user.findOne({ _id: usrResp.user.id });

      if (usr == null) {
        return done(null, false);
      } else {
        return done(null, { id: usrResp.user.id });
      }
    } catch (e) {
      return done(e);
    }
  } else {
    usr = await mh.user.findOne({ _id: idInt });
    if (usr == null) return done(null, false);

    const match = await bcrypt.compare(code, usr.tokenHash);

    if (match) {
      return done(null, { id: idInt, code: code });
    }
    return done(null, false);
  }
}

// configure passport.js to use the local strategy
passport.use(
  new Strategy(
    {
      usernameField: "id",
      passwordField: "code",
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
