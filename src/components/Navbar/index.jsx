import './index.scss'
import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Container,
    Nav,
    Navbar,
    Button
} from 'react-bootstrap'
import { AppContext } from '../Provider'
import cmuLogo from '../../assets/cmu.png'
import { redirectToCmuOauth, Logout } from '../Authentication'

function AppNavbar() {
    const location = useLocation().pathname;
    const isLogin = localStorage.getItem('isLogin') ?? false
    const loginInfo = isLogin && JSON.parse(localStorage.getItem('loginInfo'))
    const fullNameTh = loginInfo.firstname_TH + ' ' + loginInfo.lastname_TH
    const roleLevel = JSON.parse(localStorage.getItem('loginInfo'))?.role ?? 0
    const gradeTypeTitleinNav = (localStorage.getItem('gradeType') === null ? 'I,P' : localStorage.getItem('gradeType').toUpperCase())

    const { AppThisSemester, AppThisYear } = useContext(AppContext)
    const semesterYearTitle = AppThisSemester + '/' + AppThisYear

    function handleLoginClick() {
        redirectToCmuOauth()
    }

    function handleLogoutClick() {
        Logout()
    }

    return (
        <>
            <Navbar expand='xl' className='border-bottom'>
                <Container fluid className='justify-content-between'>
                    <Navbar.Brand href={location == '/' ? '#' : '/'}>
                        <img src={cmuLogo} alt='CMU logo' width='30' height='30' className='me-2' />
                        Online {gradeTypeTitleinNav} Grade {semesterYearTitle}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='me-auto'>
                            {isLogin &&
                                <>
                                    {roleLevel >= 1 && <Nav.Link href='/teacher' className='text-black-50'>บันทึกลำดับขั้น</Nav.Link>}
                                    {roleLevel >= 2 && <Nav.Link href='/department' className='text-black-50'>ยืนยันเกรด (ภาควิชา)</Nav.Link>}
                                    {roleLevel >= 3 && <Nav.Link href='/faculty' className='text-black-50'>ยืนยันเกรด (คณะ)</Nav.Link>}
                                    {roleLevel >= 3 && <Nav.Link href='/faculty/send' className='text-black-50'>นำส่งสำนักทะเบียน</Nav.Link>}
                                    {roleLevel >= 9 && <Nav.Link href='/verify' className='text-black-50'>ยืนยันเกรดสำนักทะเบียนฯ</Nav.Link>}
                                    <Nav.Link href='/summary' disabled className='text-black-50'>ภาพรวม</Nav.Link>
                                </>
                            }
                            <Nav.Link disabled className='text-black-50'>คู่มือการใช้งาน</Nav.Link>
                        </Nav>
                        {isLogin
                            ?
                            <>
                                <span className='me-2 d-block d-xl-inline '>{fullNameTh}</span>
                                <Button variant="primary" onClick={handleLogoutClick}>ออกจากระบบ</Button>
                            </>
                            :
                            <Button variant="primary" onClick={handleLoginClick}>เข้าสู่ระบบ</Button>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <hr className="border-light my-0" />
        </>
    );
}

export default AppNavbar;