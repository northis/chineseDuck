import * as errors from "../../../errors";
import { sendCode } from "../../../services/telegram";
/**
 * Operations on /user/auth
 */
const ops = {
  /**
   * summary: Send the auth code to user via sms
   * description:
   * parameters: body
   * produces: application/json
   * responses: 200, 400, 404
   */
  post: async function authUser(req, res, next) {
    /**
     * Get the data for response 200
     * For response `default` status 200 is used.
     */
    if (
      !req.body.phone ||
      req.body.phone.length > 16 ||
      !req.body.phone.startsWith("+")
    ) {
      errors.e400(next);
      return;
    }

    const status = 200;
    let result = await sendCode(req.body.phone);
    console.info(result);

    if (result) {
      return res.status(status).send(JSON.stringify({ hash: result }));
    } else {
      errors.e404(next);
    }
  }
};

export default ops;
