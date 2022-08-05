
import './index.scss'

import {
    Container,
} from 'react-bootstrap'

import MainLayout from '../../layouts/MainLayout'
import TestBar from '../StepProgressBar'

function Welcome() {
    return (
        <MainLayout>
            <div>
                <Container fluid className='welcome-image text-center d-flex justify-content-center align-items-center'>
                    <div>
                        <h2 className="text-white">ส่งลำดับขั้นแก้ไขอักษร I,P</h2>
                        <h3 className="text-white">ภาคการศึกษา 2/2598</h3>
                    </div>
                </Container>
            </div>
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