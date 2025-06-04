
const isLoggedIn = (req, res, next) => {
    if (!loggedIn) {
        return res.status(401).send("Unauthorized");
    }

    next();
};

const isAdmin = (req, res, next) => {
    const isAdmin = req.session.isLoggedIn && req.session.user?.permissions[0].id === 99;

    if (!isAdmin) {
        return res.status(403).send("Forbidden");
    }

    next();
};


module.exports = {
    isLoggedIn,
    isAdmin
}