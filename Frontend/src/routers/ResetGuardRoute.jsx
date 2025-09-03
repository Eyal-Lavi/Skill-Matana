import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate , useParams } from "react-router-dom";
import AuthAPI from '../features/auth/AuthAPI';


const ResetGuardRoute = ({children}) => {
    const {token} = useParams();
    const [valid , setValid] = useState(null);
    useEffect(() => {
        const verifyToken = async(token) => {
            try{
                const result  = await AuthAPI.checkToken(token);
                setValid(result);
            }catch(e){
                setValid(false);
            }
        }

        verifyToken(token);
    } , [token])
    if (valid === null) {return <p>Loading...</p>}

    if(!valid) {return <Navigate to='/auth/login' replace/>}

    return React.cloneElement(children , {token});
}

export default ResetGuardRoute