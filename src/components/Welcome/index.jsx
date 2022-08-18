
import './index.scss'
import {
    Container,
    Form,
} from 'react-bootstrap'
import { useState, useContext } from 'react'
import { AppContext } from '../../app'

import MainLayout from '../../layouts/MainLayout'
import TestBar from '../StepProgressBar'

function Welcome() {
    const { AppThisSemester, AppThisYear, AppGradeType } = useContext(AppContext)
    const [gradeTypeTitle, setGradeTypeTitle] = useState(AppGradeType)

    function onChangeGradeType(value) {
        localStorage.setItem('gradeType', value)
        setGradeTypeTitle(value)
        document.title = document.title.replace('I,P', value)
    }

    return (
        <MainLayout>

            <Container fluid className='welcome-image text-center d-flex flex-column justify-content-center align-items-center'>
                <h2 className="text-white">ส่งลำดับขั้นแก้ไขอักษร {gradeTypeTitle}</h2>
                <h3 className="text-white">ภาคการศึกษา {AppThisSemester} / {AppThisYear}</h3>
                <div>
                    <Form.Select onChange={e => onChangeGradeType(e.target.value)}>
                        <option value="">กรุณาเลือกประเภทการส่งลำดับขั้น</option>
                        <option value="i">ส่งลำดับขั้นแก้ไขอักษร I</option>
                        <option value="p">ส่งลำดับขั้นแก้ไขอักษร P</option>
                    </Form.Select>
                </div>
            </Container>

            <div className='text-center mt-5'>
                <h3 className='text-dark'>ลำดับขั้นตอนการส่งลำดับขั้นแก้ไขอักษร I,P</h3>
            </div>
            <Container>
                <TestBar />
            </Container>
        </MainLayout>
    )
}

export default Welcome