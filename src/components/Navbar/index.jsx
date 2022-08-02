import './index.scss'
import cmuLogo from '../../assets/cmu.png'
import { redirectToCmuOauth, Logout } from '../Authentication'

import {
    Container,
    Nav,
    Navbar,
    // NavDropdown,
    Button
} from 'react-bootstrap'

function AppNavbar() {
    const semesterYear = "2/65"
    const loginInfo = localStorage.getItem('loginInfo')
    const isLogin = localStorage.getItem('isLogin')


    function handleLoginClick() {
        redirectToCmuOauth()
    }

    function handleLogoutClick() {
        Logout()
    }

    return (
        <>
            <Navbar expand='lg'>
                <Container fluid className='justify-content-between'>
                    <Navbar.Brand href="#home">
                        <img src={cmuLogo} alt='CMU logo' width='30' height='30' className='me-2' />
                        Online I,P Grade {semesterYear}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls='basic-navbar-nav' />
                    <Navbar.Collapse id='basic-navbar-nav'>
                        <Nav className='me-auto'>
                            {isLogin &&
                                <>
                                    <Nav.Link className='text-black-50'>บันทึกลำดับขั้น</Nav.Link>
                                    <Nav.Link className='text-black-50'>ยืนยันเกรด</Nav.Link>
                                    <Nav.Link className='text-black-50'>นำส่งสำนักทะเบียน</Nav.Link>
                                    <Nav.Link className='text-black-50'>ยืนยันเกรดสำนักทะเบียนฯ</Nav.Link>
                                    <Nav.Link className='text-black-50'>ภาพรวม</Nav.Link>
                                </>}
                            <Nav.Link className='text-black-50'>คู่มือการใช้งาน</Nav.Link>
                        </Nav>
                        {isLogin
                            ?
                            <>
                                <span className='me-2 d-block d-xl-inline '>{loginInfo.userName}</span>
                                <Button variant="primary" onClick={handleLogoutClick}>ออกจากระบบ</Button>
                            </>
                            :
                            <Button variant="primary" onClick={handleLoginClick}>เข้าสู่ระบบ</Button>
                        }
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <hr className=" border-light my-0" />
        </>
    );
}

export default AppNavbar;