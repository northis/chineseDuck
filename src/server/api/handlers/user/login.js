"use strict";
import passport from "../../../security/passport";
import * as errors from "../../../errors";
/**
 * Operations on /user/login
 */
const out = {
  /**
   * summary: Logs user into the system
   * description:
   * parameters: phone, code
   * produces: application/json
   * responses: 200, 400, 404
   */
  post: function loginUser(req, res, next) {
    /**
     * Get the data for response 200
     * For response `default` status 200 is used.
     */
    var status = 200;
    console.info(200);

    passport.authenticate("local", (err, user, info) => {
      req.login(user, err => {
        if (err === undefined) {
          return res
            .status(status)
            .send("You were authenticated & logged in!\n");
        } else {
          errors.e400(next, err);
        }
      });
    })(req, res, next);
  }
};

export default out;
