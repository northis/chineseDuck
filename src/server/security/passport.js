import passport from "passport";
import Strategy from "passport-local";
import { generatePassword } from "password-generator";
import { bcrypt } from "bcrypt";
import { signIn } from "../../server/services/telegram";
import mh from "../../server/api/db";

const users = [
  { id: 100, phone: "+79200000000", code: 43312, password: "password" }
];

// configure passport.js to use the local strategy
passport.use(
  new Strategy(
    {
      usernameField: "id",
      passwordField: "code"
    },
    async (id, code, done) => {
      let usr = undefined;
      const idInt = id.startsWith("+") ? NaN : +id;
      if (isNaN(idInt)) {
        let codeParts = code.split("|");
        try {
          let usrResp = await signIn(id, codeParts[0], codeParts[1]);

          usr = await mh.user.findOne({ _id: usrResp.user.id });

          if (usr == null) {
            return done(null, false);
          } else {
            let pwd = generatePassword(12, false);
            let hash = await bcrypt.hash(pwd, 10);
            await mh.user.updateOne(
              { _id: usrResp.user.id },
              { tokenHash: hash }
            );
            return done(null, { id: usrResp.user.id, code: pwd });
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
  )
);

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  done(null, user ? user.id : false);
});

passport.deserializeUser((id, done) => {
  const user = users[0].id === id ? users[0] : false;
  done(null, user);
});

export default passport;
