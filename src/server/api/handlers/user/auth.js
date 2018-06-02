"use strict";
import * as errors from "../../../errors";
/**
 * Operations on /user/auth
 */
const ops = {
  /**
   * summary: Send the auth code to user via sms
   * description:
   * parameters: pnone
   * produces: application/json
   * responses: 200, 400, 404
   */
  post: function authUser(req, res, next) {
    /**
     * Get the data for response 200
     * For response `default` status 200 is used.
     */
    var status = 200;
    if ("+79267000000" == req.body) {
      return res.status(status).send("Code has been successfully sent!\n");
    } else {
      errors.e401(next);
    }
  }
};

export default ops;
