export const main = {
  /**
   * summary: Get system datetime
   * description:
   * parameters:
   * produces: application/json
   * responses: 200
   */
  get: function getDatetime(req, res, next) {
    var status = 200;
    let ad = new Date();
    res.status(status).send(ad);
  }
};
