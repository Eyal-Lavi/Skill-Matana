// Note: This project uses CommonJS. If switching to ES Modules, replace
// require/module.exports with import/export accordingly.

/**
 * Middleware (dev): extract userId/userName from real session/JWT if present.
 * Otherwise allow via query: ?userId=u1&userName=Dan
 * TODO: Replace with real Auth integration.
 * @param {import('express').Request} req
 * @param {import('express').Response} _res
 * @param {import('express').NextFunction} next
 */
function authOptional(req, _res, next) {
  const userId = (req.user && req.user.id) || req.query.userId || 'dev-user';
  const userName = (req.user && req.user.name) || req.query.userName || 'Dev User';
  req.auth = {
    userId: String(userId).slice(0, 64),
    userName: String(userName).slice(0, 64),
  };
  next();
}

module.exports = { authOptional };

