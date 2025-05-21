
const isLoggedIn = ( req , res , next ) =>{
    if(req.session.isLoggedIn){
        res.cookie('isLoggedIn',true);
    }else{
        res.cookie('isLoggedIn',false);
    }
    next();
}
const isAdmin = ( req , res , next ) =>{
    if(req.session.user.permissions === 99){
        res.cookie('isAdminIn',true);
    }else{
        res.cookie('isAdminIn',false);
    }
    next();
}

module.exports = {
    isLoggedIn,
    isAdmin
}