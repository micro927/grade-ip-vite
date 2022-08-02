
import MainLayout from '../../layouts/MainLayout'
import WelcomeBoard from '../WelcomeBoard'

function Welcome() {
    const isLogin = localStorage.getItem('isLogin') ?? false
    const loginInfo = isLogin ? JSON.parse(localStorage.getItem('loginInfo')) : {}
    const cmuitaccountName = loginInfo.cmuitaccount_name
    return (
        <MainLayout>
            <WelcomeBoard />
            <h1>{cmuitaccountName}</h1>
        </MainLayout>
    )
}

export default Welcome