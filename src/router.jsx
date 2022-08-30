import {
    useEffect,
    useState,
} from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";
import { Authentication, checkUserToken } from "./components/Authentication";

// page for route
import Welcome from './pages/Welcome';
import TeacherListCourse from "./pages/Teacher/CourseList"
import FillGrade from './pages/Teacher/FillGrade';
import DepartmentSubmit from "./pages/Department/Submit";
import * as Error from './pages/ErrorWarning';

const AppRouter = () => {
    const [tokenValidation, setTokenValidation] = useState()

    const VerifyWithRow = (props) => {
        const roleValidation = JSON.parse(localStorage.getItem('loginInfo'))?.role ?? 0
        return props.isValid || true
            ? (roleValidation >= props.level
                ?
                <Outlet />
                : <Navigate to='/401' />)
            : <Navigate to='/' />
    }

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
        <BrowserRouter>
            <Routes>
                <Route index element={<Welcome />} />
                <Route path='/teacher' element={<VerifyWithRow isValid={tokenValidation} level={1} />} >
                    <Route index element={<TeacherListCourse />} />
                    <Route path="fill/:classId" element={<FillGrade />} />
                </Route>
                <Route path='/department' element={<VerifyWithRow isValid={tokenValidation} level={2} />} >
                    <Route index element={<DepartmentSubmit />} />
                </Route>
                <Route path='/faculty' element={<VerifyWithRow isValid={tokenValidation} level={3} />} >
                    <Route index element={<Welcome />} />
                    <Route path="send" element={<Welcome />} />
                </Route>
                <Route path='/verify' element={<VerifyWithRow isValid={tokenValidation} level={9} />} >
                    <Route index element={<Welcome />} />
                </Route>
                <Route path='/summary' element={<Welcome />} />
                <Route path='/authentication' element={<Authentication />} />
                <Route path='*' element={<Error.Error404 />} />
                <Route path='401' element={<Error.Error401 />} />
                <Route path='500' element={<Error.Error500 />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter