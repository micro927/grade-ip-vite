import Spinner from 'react-bootstrap/Spinner';
import {
    Navigate,
    useSearchParams,
} from 'react-router-dom';
import axios from 'axios';
import AlertLayout from '../../layouts/AlertLayout'

const redirectToCmuOauth = () => {
    const oauthLoginUrl = import.meta.env.VITE_CMU_OAUTH_LOGIN_URL
    const clientId = import.meta.env.VITE_CMU_OAUTH_CLIENT_ID
    const redirectUrl = import.meta.env.VITE_CMU_OAUTH_REDIRECT_URL
    const state = import.meta.env.VITE_CMU_OAUTH_STATE
    const cmuLoginUrl = `${oauthLoginUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${state}`
    window.location.href = cmuLoginUrl
}

const clearLocalStorage = () => {
    localStorage.removeItem('isLogin')
    localStorage.removeItem('loginInfo')
    localStorage.removeItem('userToken')
    localStorage.removeItem('gradeType')
}

const Logout = () => {
    clearLocalStorage()
    return window.location.href = '/'
}

const Authentication = () => {
    const isLogin = localStorage.getItem('isLogin') || false

    function DoAuthenticate() {
        const [searchParams] = useSearchParams()
        const cmuCode = searchParams.get("code") ?? false
        if (cmuCode) {
            const appLoginUrl = (import.meta.env.VITE_API_HOST) + '/login'
            axios
                .get(`${appLoginUrl}?code=${cmuCode}`)
                .then(async (response) => {
                    localStorage.setItem('loginInfo', JSON.stringify(response?.data))
                    localStorage.setItem('isLogin', true)
                    localStorage.setItem('userToken', await response.data?.userToken)
                    console.log(await response.data.cmuitaccount_name);
                    window.location.href = '/'
                })
                .catch((error) => {
                    console.log(error);
                    // window.location.href = '/'

                })
        } else {
            redirectToCmuOauth
        }
    }

    return (
        !isLogin
            ?
            <AlertLayout>
                <div className='mt-5 text-center' onLoad={DoAuthenticate()}>
                    <Spinner variant="secondary" animation="border" />
                    <p>Logging in with CMU IT Account.......</p>
                </div>
            </AlertLayout>
            :
            <Navigate to='/' replace />
    )
}

const checkUserToken = async (userToken) => {
    const appApiHost = import.meta.env.VITE_API_HOST
    let isValid = false
    await axios
        .get(`${appApiHost}/checkusertoken`,
            {
                headers: { 'Authorization': 'Bearer ' + userToken },
            }
        )
        .then(async (response) => {
            isValid = await response?.data?.isAuthorized || false;
            if (!isValid) {
                clearLocalStorage()
            }
        })
        .catch((error) => {
            console.error('API CHECK ERROR : ' + error.code)
            isValid = error.response.data?.isAuthorized || false
            // window.location.href = './'
        })
    return isValid
}

export { Authentication, checkUserToken, redirectToCmuOauth, Logout }