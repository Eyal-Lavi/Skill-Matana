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

