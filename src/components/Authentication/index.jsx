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

function Logout() {
    localStorage.removeItem('isLogin')
    localStorage.removeItem('loginInfo')
    localStorage.removeItem('userToken')
    localStorage.removeItem('gradeType')
    return (
        window.location.reload())
}

const Authentication = () => {
    const isLogin = localStorage.getItem('isLogin')

    function DoAuthenticate() {
        const [searchParams] = useSearchParams()
        const cmuCode = searchParams.get("code") ?? false
        if (cmuCode) {
            //axios api
            const appLoginUrl = (import.meta.env.VITE_API_HOST) + '/login'
            // console.log('ยิง AXIOS');
            axios
                .get(`${appLoginUrl}?code=${cmuCode}`)
                .then(function (response) {
                    // handle success
                    localStorage.setItem('loginInfo', JSON.stringify(response.data))
                    localStorage.setItem('isLogin', true)
                    localStorage.setItem('userToken', response.data.userToken)
                    console.log(response.data.cmuitaccount_name);
                    window.location.href = '/'
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                    window.location.href = '/500'
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

const checkUserToken = async () => {
    const appApiHost = import.meta.env.VITE_API_HOST
    const userToken = localStorage.getItem('userToken') ?? false
    let isValid = false
    if (userToken) {
        await axios
            .get(`${appApiHost}/checkusertoken`,
                {
                    headers: { 'Authorization': 'Bearer ' + userToken },
                }
            )
            .then(function (response) {
                isValid = response.data.isAuthorized;
            })
            .catch(function (error) {
                console.error('API CHECK ERROR : ' + error.code)
                isValid = error.response.data?.isAuthorized || false
                // window.location.href = './'
            })
    }
    return isValid
}

export { Authentication, checkUserToken, redirectToCmuOauth, Logout }