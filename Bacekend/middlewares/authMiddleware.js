
const isLoggedIn = ( req , res , next ) =>{
    if(req.session.isLoggedIn){
        res.cookie('isLoggedIn',true);
    }else{
        res.cookie('isLoggedIn',false);
    }
    next();
}

module.exports = {
    isLoggedIn,
}