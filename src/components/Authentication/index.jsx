import { createContext, useReducer } from 'react';
import {
    Navigate,
    useSearchParams,
} from 'react-router-dom';
import axios from 'axios';
import AlertLayout from '../../layouts/AlertLayout'

function redirectToCmuOauth() {
    const oauthLoginUrl = import.meta.env.VITE_CMU_OAUTH_LOGIN_URL
    const clientId = import.meta.env.VITE_CMU_OAUTH_CLIENT_ID
    const redirectUrl = import.meta.env.VITE_CMU_OAUTH_REDIRECT_URL
    const state = import.meta.env.VITE_CMU_OAUTH_STATE
    const cmuLoginUrl = `${oauthLoginUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${state}`
    window.location.href = cmuLoginUrl
}
var isLogin = false
var loginInfo = {}

function DoAuthenticate() {
    const [searchParams] = useSearchParams()
    const cmuCode = searchParams.get("code") ?? false
    if (cmuCode) {
        //axios api
        const appLoginUrl = import.meta.env.VITE_APP_LOGIN_URL
        console.log('ยิง AXIOS');
        axios
            .get(`${appLoginUrl}?code=${cmuCode}`)
            .then(function (response) {
                // handle success
                loginInfo = response.data
                isLogin = true
                console.log(response.data.cmuitaccount_name);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                return (<Navigate to='/404' />)
            })
    } else {
        redirectToCmuOauth()
    }
}

function Authentication() {
    return (
        !isLogin
            ?
            <AlertLayout>
                <p onLoad={DoAuthenticate()}></p>Logging in with CMU IT Account.......
            </AlertLayout>
            :
            <Navigate to='/' />
    )
}

export default Authentication