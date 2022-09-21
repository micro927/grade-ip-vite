import {
    useContext
} from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet
} from "react-router-dom";
import PropTypes from 'prop-types';

// Authentication functions/components
import { AppContext } from './components/Provider'
import { Authentication } from "./components/Authentication";

// Page components for route
import Welcome from './pages/Welcome';
import TeacherListCourse from "./pages/Teacher/CourseList"
import FillGrade from './pages/Teacher/FillGrade';
import DepartmentSubmit from "./pages/Department/Submit";
import FacultySubmit from "./pages/Faculty/Submit";
import FacultySend from "./pages/Faculty/Send";
import AdminVerify from "./pages/Admin/Verify";
import ErrorWarning from './pages/ErrorWarning';

const VerifyWithRole = ({ levelRequired }) => {
    const { tokenValidation } = useContext(AppContext)
    const userRole = JSON.parse(localStorage.getItem('loginInfo'))?.role ?? 0

    // debug
    // const { pathname } = useLocation()
    // console.log(pathname, tokenValidation)

    return (tokenValidation || true) /// move tokenValidation to contextprovider ,but still doesnt work.
        ? (userRole >= levelRequired
            ?
            <Outlet />
            : <Navigate to='/401' />)
        : <Navigate to='/' />

}
VerifyWithRole.propTypes = {
    levelRequired: PropTypes.number
}

const AppRouter = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route index element={<Welcome />} />
                    <Route path='/teacher' element={<VerifyWithRole levelRequired={1} />} >
                        <Route index element={<TeacherListCourse />} />
                        <Route path="fill/:classId" element={<FillGrade />} />
                    </Route>
                    <Route path='/department' element={<VerifyWithRole levelRequired={2} />} >
                        <Route index element={<DepartmentSubmit />} />
                    </Route>
                    <Route path='/faculty' element={<VerifyWithRole levelRequired={3} />} >
                        <Route index element={<FacultySubmit />} />
                        <Route path="send" element={<FacultySend />} />
                    </Route>
                    <Route path='/verify' element={<VerifyWithRole levelRequired={9} />} >
                        <Route index element={<AdminVerify />} />
                    </Route>
                    <Route path='/summary' element={<Welcome />} />
                    <Route path='/authentication' element={<Authentication />} />
                    <Route path='*' element={<ErrorWarning errorCode={404} />} />
                    <Route path='401' element={<ErrorWarning errorCode={401} />} />
                    <Route path='500' element={<ErrorWarning errorCode={500} />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default AppRouter