import './index.scss'
import PropTypes from 'prop-types';
import Swal from 'sweetalert2'
import { datetimeTextThai, getAllSubmitStatusTitle } from '../../utils';

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
        facuser_deliver_itaccountname,
        facuser_deliver_datetime,
        reg_submit_itaccountname,
        reg_submit_datetime,
        all_student,
        filled_student
    } = classData || {}
    const allStatusTitle = getAllSubmitStatusTitle()


    const content = [
        {
            status: 0,
            statusTitle: allStatusTitle[0],
            swalDoneTitle: null,
            swalDoneDetailHtml: null,
        },
        {
            status: 1,
            statusTitle: allStatusTitle[1],
            swalDoneTitle: 'กรอกลำดับขั้นแล้ว',
            swalDoneDetailHtml: `
            <p>จำนวนนักศึกษาที่กรอกลำดับขั้นแล้ว: ${filled_student}/${all_student} ราย</p>
            `,
        },
        {
            status: 2,
            statusTitle: allStatusTitle[2],
            swalDoneTitle: 'ภาควิชายืนยันแล้ว',
            swalDoneDetailHtml: `
                    ผู้ยืนยันลำดับขั้น: ${deptuser_submit_itaccountname}
                    <br>
                    วันเวลาที่ยืนยัน: ${datetimeTextThai(deptuser_submit_datetime)}
                `
        },
        {
            status: 3,
            statusTitle: allStatusTitle[3],
            swalDoneTitle: 'คณะยืนยันแล้ว',
            swalDoneDetailHtml: `
                    ผู้ยืนยันลำดับขั้น (ระดับคณะ) : ${facuser_submit_itaccountname}
                    <br>
                    วันเวลาที่ยืนยัน: ${datetimeTextThai(facuser_submit_datetime)}
                `
        },
        {
            status: 4,
            statusTitle: allStatusTitle[4],
            swalDoneTitle: '',
            swalDoneDetailHtml: '',
        },
        {
            status: 5,
            statusTitle: allStatusTitle[5],
            swalDoneTitle: '',
            swalDoneDetailHtml: '',
        },
    ]
    const { status, statusTitle } = content.find(e => e.status == submit_status)
    const contentBar = content.filter(e => e.status > 0)

    return (
        <>
            <div className='text-center'>
                <div className="wrapper-progress-stepper">
                    <ul className="progress-stepper">
                        {contentBar.map(e => {
                            const statusClass = e.status <= status ? 'active' : 'disabled'
                            return (
                                <li key={e.status} onClick={() => Swal.fire(
                                    {
                                        title: e.swalDoneTitle,
                                        html: e.swalDoneDetailHtml,
                                        icon: "info",
                                        iconColor: "#28a745",
                                        showConfirmButton: false,
                                        showCancelButton: true,
                                        cancelButtonText: 'ปิด',
                                    }
                                )} className={`d- flex flex - column justify - content - between align - items - center ${statusClass}`}>
                                </li>
                            )
                        })
                        }
                    </ul>
                </div>
                <em className='small text-center'>{statusTitle}</em>
            </div>
        </>
    )
}

StepStatusBar.propTypes = {
    classData: PropTypes.object
}

export default StepStatusBar