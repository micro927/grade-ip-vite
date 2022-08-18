import StepProgressBar from 'react-step-progress';
import './index.scss'
import {
    Button,
    Row,
    Col
} from 'react-bootstrap'

function TestBar() {
    return (
        <>
            <StepProgressBar
                startingStep={0}
                buttonWrapperClass='d-none'
                stepClass='border-info'
                steps={[
                    {
                        label: 'อาจารย์ผู้สอน',
                        subtitle: 'บันทึกลำดับขั้น',
                    },
                    {
                        label: 'เจ้าหน้าที่ภาควิชาฯ',
                        subtitle: 'ยืนยันลำดับขั้น',
                    },
                    {
                        label: 'เจ้าหน้าที่คณะ',
                        subtitle: 'ยืนยันและนำส่งลำดับขั้น',
                    },
                    {
                        label: 'สำนักทะเบียน',
                        subtitle: 'ตรวจสอบลำดับขั้น',
                    }
                ]}
            />
            <Row className='w-100 m-0 p-0'>
                <Col className='text-center'>
                    <Button href='/teacher' variant='outline-primary'>ไปหน้าบันทึก</Button>
                </Col>
                <Col className='text-center'>
                    <Button href='/department' variant='outline-primary'>ไปหน้ายืนยัน</Button>
                </Col>
                <Col className='text-center'>
                    <Button href='/faculty' variant='outline-primary'>ไปหน้ายืนยันและนำส่ง</Button>
                </Col>
                <Col className='text-center'>
                    <Button href='/verify' variant='outline-primary'>ไปหน้าตรวจสอบ</Button>
                </Col>
            </Row>
        </>
    )
}

export default TestBar