import { createContext, useEffect, useState } from "react";
import { AppConstants } from "../Util/constants";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const BackendURL = AppConstants.BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false)
    const [userData, setUserData] = useState(false)

    axios.defaults.withCredentials = true;
    const getUserdata = async () => {
        try {
            const res = await axios.get(`${BackendURL}/user/profile`)
            if (res.status === 200) {

                setUserData(res.data);
                console.log(res.data);

            }
            else {
                toast.error("unable to retrieve profile ")
            }
        } catch (error) {
            toast.error(error.message)
        }
    }


    const getAuthState = async () => {
        try {
            const res = await axios.get(`${BackendURL}/auth/is-authenticated`);
            if (res.status === 200 && res.data === true) {
                setIsLoggedin(true);
                await getUserdata()
            }
            else {
                setIsLoggedin(false)
            }

        } catch (error) {
            console.error(error.response.data.message || "unable to login");

            setIsLoggedin(false)
        }
    }

    useEffect(() => {
        getAuthState()
    }, [])

    const contextValue = {
        BackendURL,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserdata
    }
    return (

        <AppContext.Provider value={contextValue}>
            {props.children}
        </AppContext.Provider>

    )
}