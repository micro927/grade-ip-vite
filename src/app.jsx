import './styles/index.scss'
import React, { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";

import { AppContextProvider } from './components/Provider';
import { Authentication, checkUserToken } from "./components/Authentication";
import Welcome from "./components/Welcome";
import TeacherListCourse from "./components/Teacher/CourseList"
import FillGrade from './components/Teacher/FillGrade';
import { Error401, Error404 } from './components/ErrorWarning';

const isLogin = localStorage.getItem('isLogin')
const gradeType = localStorage.getItem('gradeType') ?? false
if (isLogin && !gradeType) {
    localStorage.setItem('gradeType', 'i')
}

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
        <AppContextProvider>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Welcome />} />
                    <Route path='/teacher' element={<VerifyWithRow isValid={tokenValidation} level={1} />} >
                        <Route index element={<TeacherListCourse />} />
                        <Route path="fill/:classId" element={<FillGrade />} />
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
        </AppContextProvider>
    )
}

export default App