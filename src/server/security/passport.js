import passport from "passport";
import Strategy from "passport-local";

const users = [
  { id: 100, phone: "+79267000000", code: "code", password: "password" }
];

// configure passport.js to use the local strategy
passport.use(
  new Strategy(
    {
      usernameField: "id",
      passwordField: "code"
    },
    (id, code, done) => {
      var usr = undefined;
      const idInt = id.startsWith('+') ? NaN: +id;
      if (isNaN(idInt)) {
        usr = users.find(a => a.phone == id && a.code == code);
      } else {
        usr = users.find(a => a.id == idInt && a.password == code);
      }

      if (usr !== undefined) {
        console.info("Local strategy returned true");
        return done(null, usr);
      }
      return done(null, false);
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
