import React, { useContext } from "react";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

export const UserPage = () => {

    const {userContext, setUserContext} = useContext(UserContext);
    const navigate = useNavigate();

    if(!userContext){
        navigate('/')
    }

    return(
        <div>
            asdasd
        </div>
    )
}