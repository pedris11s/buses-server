import _ from 'lodash';
// noinspection JSUnusedGlobalSymbols
/** @namespace req.query.includeToken */

module.exports = {
  /**
   * @param req
   */
  buildCallbackNextUrl: function (req) {
    let url = req.query.next;
    let includeToken = req.query.includeToken;
    let accessToken = _.get(req, 'session.tokens.accessToken');

    if (includeToken && accessToken) {
      return url + '?access_token=' + accessToken;
    } else {
      return url;
    }
  }
};
