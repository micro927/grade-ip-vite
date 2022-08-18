import './styles/index.scss'
import React, { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";

import Welcome from "./components/Welcome";
import { Error401, Error404 } from './components/ErrorWarning';
import { Authentication, checkUserToken } from "./components/Authentication";
import TeacherListCourse from "./components/Teacher/listCourse"

const AppThisSemester = import.meta.env.VITE_THIS_SEMESTER
const AppThisYear = import.meta.env.VITE_THIS_YEAR
const context = {
    AppThisSemester,
    AppThisYear
}
const AppContext = React.createContext();


const VerifyWithRow = (props) => {
    const roleValidation = JSON.parse(localStorage.getItem('loginInfo'))?.role ?? 0
    return props.isValid || true
        ? (roleValidation >= props.level
            ?
            <Outlet />
            : <Navigate to='/401' />)
        : <Navigate to='/' />

}

const App = () => {
    const [tokenValidation, setTokenValidation] = useState()
    useEffect(() => {
        (async () => {
            await checkUserToken().then(
                (res) => {
                    setTokenValidation(res)
                }
            )
        })()
        // /// STILL ERROR : tokenValidation still & stuck False in VerifyWithRow
    }, [tokenValidation]);

    return (
        <AppContext.Provider value={context}>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Welcome />} />
                    <Route path='/teacher' element={<VerifyWithRow isValid={tokenValidation} level={1} />} >
                        <Route index element={<TeacherListCourse />} />
                    </Route>
                    <Route path='/department' element={<VerifyWithRow isValid={tokenValidation} level={2} />} >
                        <Route index element={<Welcome />} />
                    </Route>
                    <Route path='/faculty' element={<VerifyWithRow isValid={tokenValidation} level={3} />} >
                        <Route index element={<Welcome />} />
                    </Route>
                    <Route path='/verify' element={<VerifyWithRow isValid={tokenValidation} level={9} />} >
                        <Route index element={<Welcome />} />
                    </Route>
                    <Route path='/summary' element={<Welcome />} />
                    <Route path='/authentication' element={<Authentication />} />
                    <Route path='*' element={<Error404 />} />
                    <Route path='401' element={<Error401 />} />
                </Routes>
            </BrowserRouter>
        </AppContext.Provider>
    )
}
export { AppContext }
export default App