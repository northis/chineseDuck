import * as errors from "../../../errors";
/**
 * Operations on /user/logout
 */
const out = {
  /**
   * summary: Erase the user token, so user have to recreate it next time
   * description:
   * parameters:
   * produces: application/json
   * responses: 200
   */
  get: function logoutUser(req, res, next) {
    /**
     * Get the data for response 200
     * For response `default` status 200 is used.
     */
    var status = 200;

    if (req.isAuthenticated()) {
      res.status(status).send("you hit the authentication endpoint\n");
    } else {
      errors.e401(next);
    }
  }
};
export default out;
