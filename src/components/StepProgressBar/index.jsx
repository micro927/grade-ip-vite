import './index.scss'
import {
    Button,
} from 'react-bootstrap'

function StepProgressBar() {
    const role = JSON.parse(localStorage.getItem('loginInfo'))?.role ?? 0
    const stepContent = [
        {
            label: 'อาจารย์ผู้สอน',
            subtitle: 'บันทึกลำดับขั้น',
            button: 'ไปหน้าบันทึก',
            to: '/teacher',
            levelRequire: 1
        },
        {
            label: 'เจ้าหน้าที่ภาควิชาฯ',
            subtitle: 'ยืนยันลำดับขั้น',
            button: 'ไปหน้ายืนยัน',
            to: '/department',
            levelRequire: 2
        },
        {
            label: 'เจ้าหน้าที่คณะ',
            subtitle: 'ยืนยันลำดับขั้น',
            button: 'ไปหน้ายืนยัน',
            to: '/faculty',
            levelRequire: 3
        },
        {
            label: 'เจ้าหน้าที่คณะ',
            subtitle: 'นำส่งลำดับขั้น',
            button: 'ไปหน้านำส่ง',
            to: '/faculty/send',
            levelRequire: 3
        },
        {
            label: 'สำนักทะเบียน',
            subtitle: 'ตรวจสอบลำดับขั้น',
            button: 'ไปหน้าตรวจสอบ',
            to: '/verify',
            levelRequire: 9
        }
    ]
    return (
        <>
            <div className="wrapper-progress-stepper">
                <ul className="progress-stepper">
                    {stepContent.map((step, index) => {
                        return (
                            <li key={index} className="d-flex flex-column justify-content-between align-items-center">
                                <h5 className='text-dark'>{step.label}</h5>
                                <h6 className="">{step.subtitle}</h6>
                                <Button variant='outline-dark' className="" href={step.to} disabled={role < step.levelRequire}>{step.button}</Button>
                            </li>
                        )
                    })
                    }
                </ul>
            </div>
        </>
    )
}

export default StepProgressBar