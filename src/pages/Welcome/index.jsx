
import './index.scss'
import {
    Container,
    Form,
    Row,
    Col
} from 'react-bootstrap'
import { useState, useContext } from 'react'
import WelcomeLayout from '../../layouts/WelcomeLayout'
import StepProgressBar from '../../components/StepProgressBar'
import { AppContext } from '../../components/Provider'

function Welcome() {
    const { AppThisSemester, AppThisYear } = useContext(AppContext)
    const gradeType = localStorage.getItem('gradeType') ?? false
    const isLogin = localStorage.getItem('isLogin') ?? false
    const [gradeTypeTitle, setGradeTypeTitle] = useState(gradeType ? gradeType.toUpperCase() : 'I,P')

    function onChangeGradeType(target) {
        const grade = target.value
        if (grade != '') {
            localStorage.setItem('gradeType', grade)
            const gradeTitle = grade.toUpperCase()
            setGradeTypeTitle(gradeTitle)
        }
    }

    return (
        <WelcomeLayout>
            <Container fluid className='welcome-image text-center d-flex flex-column justify-content-center align-items-center'>
                <div>
                    <h2 className="text-white">ส่งลำดับขั้นแก้ไขอักษร {gradeTypeTitle}</h2>
                    <h3 className="text-white">ภาคการศึกษา {AppThisSemester} / {AppThisYear}</h3>
                    <Row>
                        <Col lg="12">
                            {isLogin && <Form.Select onChange={e => onChangeGradeType(e.target)}>
                                <option value="">เลือกประเภทการส่งลำดับขั้นที่นี่ ...</option>
                                <option value="i">ส่งลำดับขั้นแก้ไขอักษร I</option>
                                <option value="p">ส่งลำดับขั้นแก้ไขอักษร P</option>
                            </Form.Select>}
                        </Col>
                    </Row>
                </div>
            </Container>

            <div className='text-center mt-5'>
                <h3 className='text-dark'>ลำดับขั้นตอนการส่งลำดับขั้นแก้ไขอักษร I,P</h3>
            </div>
            <Container className='mt-5'>
                <StepProgressBar />
            </Container>
        </WelcomeLayout>
    )
}

export default Welcome