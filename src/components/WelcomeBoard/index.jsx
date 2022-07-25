import './index.scss'
import { useState, useRef } from 'react';

import {
    Container,
    Row,
    Col,
    Form,
    Overlay,
    Tooltip,
} from 'react-bootstrap'

function WelcomeBoard() {
    const ref = useRef(null);
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);

    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    };

    const fakeLoginInfo = {
        isLogged: false,
        userName: "Micro Micro",
        role: "REG"
    }
    return (
        <Container fluid className='hero-section d-flex justify-content-center align-items-center'>
            <div className='w-50'>
                <Row className="text-center">
                    <Col xs={12}>
                        <h2 className="text-white">
                            ส่งลำดับขั้นแก้ไขอักษร I,P
                        </h2>
                        <h3 className="text-white">
                            ภาคการศึกษา 2/2599
                        </h3>
                    </Col>
                </Row>
                <Row className='justify-content-center mt-4'>
                    <Col md={8} ref={ref}>
                        <Form.Select defaultValue="" id="select_sy" onClick={handleClick}>
                            <option value="" disabled>เลือกภาคการศึกษา</option>
                            {fakeLoginInfo.isLogged &&
                                <>
                                    <option value="12565">ภาคการศึกษา 1/2565</option>
                                    <option value="22565">ภาคการศึกษา 2/2565</option>
                                    <option value="y2565">ปีการศึกษา 2565(รายปี)</option>
                                </>}
                        </Form.Select>
                        {(!fakeLoginInfo.isLogged) &&
                            <Overlay
                                show={show}
                                target={target}
                                placement="right"
                                container={ref}
                            >
                                <Tooltip id="popover-contained">
                                    <strong>กรุณาเข้าสู่ระบบก่อน</strong>
                                </Tooltip>
                            </Overlay>
                        }
                    </Col>
                </Row>
            </div>
        </Container>
    )
}

export default WelcomeBoard