import './index.scss'
import {
    Button,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap'
import PropTypes from 'prop-types';
import Swal from 'sweetalert2'

function StepStatusBar({ classData }) {
    const {
        submit_status,
        instructor_id,
        last_date,
        submission_id,
        deptuser_submit_itaccountname,
        deptuser_submit_datetime,
        facuser_submit_itaccountname,
        facuser_submit_datetime,
        deliver_id,
        deliver_datetime,
        reg_submit_itaccountname,
        reg_submit_datetime,
        all_student,
        fill_student,
        is_fill
    } = classData || {}

    let barContent = [
        {
            status: 'wait_dept',
            step: 1,
            swalTitle: 'สถานะการกรอกลำดับขั้น',
            swalHtml: `
            <p>จำนวน ${all_student} ราย</p>
            <p>กรอกลำดับขั้นล่าสุดเมื่อ ${last_date}</p>
            `,
            thisStatusTitle: 'รอภาควิชาฯ ยืนยัน',
        },
        {
            status: 'wait_fac',
            step: 2,
            swalTitle: '',
            swalHtml: '',
            thisStatusTitle: 'รอคณะยืนยัน',
        },
        {
            status: 'wait_deliver',
            step: 3,
            swalTitle: '',
            swalHtml: '',
            thisStatusTitle: 'รอคณะนำส่ง',
        },
        {
            status: 'wait_reg',
            step: 4,
            swalTitle: '',
            swalHtml: '',
            thisStatusTitle: 'รอสำนักทะเบียนฯ ยืนยัน',
        },
        {
            status: 'complete',
            step: 5,
            title: 'ส่งลำดับขั้นเรียบร้อย',
            swalTitle: '',
            swalHtml: '',
        },
    ]

    const thisStatus = barContent.find(e => e.status == submit_status)
    const { step, thisStatusTitle } = thisStatus || { step: 0, thisStatusTitle: 'รอกรอกลำดับขั้น' }

    barContent = barContent.map(e => {
        return {
            ...e,
            stepClass: e.step <= step ? 'active' : 'disabled'
        }
    })

    return (
        <>
            <div className='text-center'>
                <div className="wrapper-progress-stepper">
                    <ul className="progress-stepper">
                        {barContent.map(e => {
                            return (
                                <li key={e.step} onClick={() => Swal.fire(
                                    {
                                        title: e.swalTitle,
                                        html: e.swalHtml,
                                        showConfirmButton: false,
                                        showCancelButton: true,
                                        cancelButtonText: 'ปิด',
                                    }
                                )} className={`d-flex flex-column justify-content-between align-items-center ${e.stepClass}`}>
                                </li>
                            )
                        })
                        }
                    </ul>
                </div>
                <em className='small text-center'>{thisStatusTitle}</em>
            </div>
        </>
    )
}

StepStatusBar.propTypes = {
    classData: PropTypes.object
}

export default StepStatusBar