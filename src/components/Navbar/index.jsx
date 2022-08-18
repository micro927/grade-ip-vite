import { useLocation } from 'react-router-dom';
import {
    Container,
    Nav,
    Navbar,
    Button
} from 'react-bootstrap'
import './index.scss'
import cmuLogo from '../../assets/cmu.png'
import { redirectToCmuOauth, Logout } from '../Authentication'

function AppNavbar() {
    const location = useLocation().pathname;
    const semesterYear = "2/65"
    const isLogin = localStorage.getItem('isLogin') ?? false
    const loginInfo = isLogin && JSON.parse(localStorage.getItem('loginInfo'))
    const fullNameTh = loginInfo.firstname_TH + ' ' + loginInfo.lastname_TH
    const roleLevel = 3 // loginInfo.role

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
                        Online I,P Grade {semesterYear}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='me-auto'>
                            {isLogin &&
                                <>
                                    {roleLevel > 0 && <Nav.Link href='/teacher' className='text-black-50'>บันทึกลำดับขั้น</Nav.Link>}
                                    {roleLevel > 1 && <Nav.Link href='/department' className='text-black-50'>ยืนยันเกรด</Nav.Link>}
                                    {roleLevel > 2 && <Nav.Link href='/faculty' className='text-black-50'>ยืนยันและนำส่งสำนักทะเบียน</Nav.Link>}
                                    {roleLevel > 3 && <Nav.Link href='/verify' className='text-black-50'>ยืนยันเกรดสำนักทะเบียนฯ</Nav.Link>}
                                    <Nav.Link href='/summary' className='text-black-50'>ภาพรวม</Nav.Link>
                                </>
                            }
                            <Nav.Link className='text-black-50'>คู่มือการใช้งาน</Nav.Link>
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