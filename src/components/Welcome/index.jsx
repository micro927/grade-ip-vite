
import './index.scss'
import {
    Container,
    Form,
    Row,
    Col
} from 'react-bootstrap'
import { useState, useContext, useEffect } from 'react'
import MainLayout from '../../layouts/MainLayout'
import TestBar from '../StepProgressBar'
import { AppContext } from '../Provider'

function Welcome() {
    const { AppThisSemester, AppThisYear } = useContext(AppContext)
    const gradeType = localStorage.getItem('gradeType') ?? false
    const isLogin = localStorage.getItem('isLogin') ?? false
    const [gradeTypeTitle, setGradeTypeTitle] = useState(gradeType ? gradeType.toUpperCase() : 'I,P')

    function onChangeGradeType(value) {
        localStorage.setItem('gradeType', value)
        const gradeTitle = value.toUpperCase()
        setGradeTypeTitle(gradeTitle)
    }

    // useEffect(() => {
    //     setGradeTypeTitle(grade)
    // }, [])

    return (
        <MainLayout>
            <Container fluid className='welcome-image text-center d-flex flex-column justify-content-center align-items-center'>
                <div>
                    <h2 className="text-white">ส่งลำดับขั้นแก้ไขอักษร {gradeTypeTitle}</h2>
                    <h3 className="text-white">ภาคการศึกษา {AppThisSemester} / {AppThisYear}</h3>
                    <Row>
                        <Col lg="12">
                            {isLogin && <Form.Select onChange={e => onChangeGradeType(e.target.value)}>
                                <option disabled value="">เลือกประเภทการส่งลำดับขั้น</option>
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
            <Container>
                <TestBar />
            </Container>
        </MainLayout >
    )
}

export default Welcome