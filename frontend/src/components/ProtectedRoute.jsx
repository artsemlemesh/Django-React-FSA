import {Navigate} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import api from '../api'
import { REFRESH_TOKEN, ACCESS_TOKEN } from '../constants'
import { useState, useEffect } from 'react'


function ProtectedRoute({children}){
    const [isAuthorized, setIsAuthorized] = useState(null)

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])



    const refreshToken = async() => {
        //get the refresh token from local storage
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)

        try {
            //send a POST request to the token refresh endpoint with the refresh token
            const res = await api.post('/api/token/refresh/', {refresh: refreshToken,});
            //check if the response status is 200
            if (res.status === 200){
                //if yes, update the access token in local storage
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
                setIsAuthorized(true)
            } else {
                setIsAuthorized(false)
            }
        } catch (error) {
            //if an error occurs(network), log it to the console
            console.log(error)
            setIsAuthorized(false)
        }
    };







    const auth = async () => {
        //get the access token from local storage
        const token = localStorage.getItem(ACCESS_TOKEN)
        //if there is no token, set the authorization status to false and return
        if (!token){
            setIsAuthorized(false)
            return
        }
        //decode token to get its expiration time
        const decoded = jwtDecode(token)
        const tokenExpiration = decoded.exp  // token expiration time in sec
        const now = Date.now() / 1000 // get the current time in seconds

        //if the token has expired, refresh it/ otherwise, set authorization status to true
        if (tokenExpiration < now){
            await refreshToken() //refresh the token
        } else {
            setIsAuthorized(true)
        }
    }

    if (isAuthorized === null){
        return <div>Loading...</div>
    }

    return isAuthorized ? children : <Navigate to='/login' />
}


export default ProtectedRoute