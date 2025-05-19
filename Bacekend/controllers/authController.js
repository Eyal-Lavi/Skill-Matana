const register = async (request,response,next) =>{
    console.log("inside register");
    response.json({
        info:"register confirm"
    });
}
const login = async (request,response,next) =>{
    console.log("inside login");

    response.json({
        info:"login confirm"
    });
}
module.exports = {
    register,
    login
}