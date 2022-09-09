import '../../styles/table.scss'
import './index.scss'
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
// import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import Swal from 'sweetalert2'
import {
    Table,
    Form,
    Button,
    ButtonGroup,
    Stack,
    Row,
    Col
} from 'react-bootstrap';
import NoDataBox from '../../components/NoDataBox';

function FillGrade() {
    const loginInfo = JSON.parse(localStorage.getItem('loginInfo'))
    const userCmuItAccountName = loginInfo?.cmuitaccount_name
    const gradeType = localStorage.getItem('gradeType') ?? false
    const gradeTypeTitle = gradeType.toUpperCase()
    const appApiHost = import.meta.env.VITE_API_HOST
    const params = useParams()
    const classId = params.classId
    const dateTimeNow = '*กำลังแก้ไข*' //new Date().toLocaleString()
    const navigate = useNavigate()


    const [studentList, setstudentList] = useState([]);
    const [gradeOption, setGradeOption] = useState([]);
    const [courseDetail, setCourseDetail] = useState([]);
    const [countGradeChange, setCountGradeChange] = useState(0);

    const getCourseDetail = async (classId) => {
        let result = []
        await axios
            .get(`${appApiHost}/teacher/coursedetail/${classId}`, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
            })
            .then(async (response) => {
                result = await response.data
                setCourseDetail(result)
                result.grade_id
                const gradeOptionList = [
                    ['', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'],
                    ['', 'S', 'U']
                ]
                setGradeOption(gradeOptionList[result.grade_id || 0])
            })
            .catch((error) => {
                const errorStatus = error.response?.status
                if (errorStatus == 403) {
                    window.location.href = '/' + errorStatus
                }
                else {
                    console.error('coursedetail API ERROR : ', error)
                    result = []
                    setCourseDetail(result)
                }
            })
    }

    const getStudentList = async (classId) => {
        let result
        await axios
            .get(`${appApiHost}/teacher/fill/${classId}`, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
            })
            .then(async (response) => {
                result = await response.data

                const enrollStatusText = (status) => {
                    let statusText
                    if (status.substring(0, 2) == '0_') {
                        statusText = 'ไม่ลงทะเบียน/ไม่ชำระเงิน/ลาพัก'
                    } else {
                        statusText = 'ลงทะเบียนแล้ว'
                    }
                    return statusText
                }
                const datetimeText = (datetime) => {
                    return datetime == null ? '' : new Date(datetime).toLocaleString('th-TH', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: 'numeric',
                        hourCycle: 'h24'
                    })
                }

                const resultWithDatetimeText = result.map(row => {
                    return ({
                        ...row,
                        edit_datetime: datetimeText(row.edit_datetime),
                        fill_datetime: datetimeText(row.fill_datetime),
                        enroll_status_text: enrollStatusText(row.enroll_status),
                    })
                })
                setstudentList(resultWithDatetimeText)
            })
            .catch((error) => {
                const errorStatus = error.response?.status
                if (errorStatus == 403) {
                    window.location.href = '/' + errorStatus
                }
                else {
                    console.error('fill API ERROR :', error)
                    result = []
                    setstudentList(result)
                }
            })
    }

    const handleGradeChange = async (event) => {
        const studentId = event.target.name
        const grade = event.target.value
        setstudentList(prevList => {
            const newList = prevList.map((row) => {
                if (row.student_id == studentId) {
                    const thisEditGrade = grade
                    const thisEditBy = row.grade_new != thisEditGrade ? userCmuItAccountName : row.fill_itaccountname
                    const thisEditdatetime = row.grade_new != thisEditGrade ? dateTimeNow : row.fill_datetime
                    return {
                        ...row,
                        edit_grade: thisEditGrade,
                        edit_by: thisEditBy,
                        edit_datetime: thisEditdatetime,
                    }
                }
                else {
                    return { ...row }
                }
            })
            return newList
        })
    }

    const handleClickConfirm = () => {
        const textForCheck = `
        <p>กระบวนวิชา : <span>${courseDetail.courseno}</span></p> 
        <p>จำนวนที่แก้ไข : <span>${countGradeChange} ราย</span></p>
        `
        Swal.fire({
            title: 'ยืนยันการบันทึกลำดับขั้น ?',
            html: textForCheck,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ยืนยันการบันทึก',
            cancelButtonText: 'ตรวจสอบอีกครั้ง',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`${appApiHost}/teacher/save/${classId}`, studentList, {
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), }
                    }).then((response) => {
                        const { status, affectedRows } = response.data
                        console.log(affectedRows || 'no affectedRows');
                        if (status == 'ok' && affectedRows > 0) {
                            navigate('/teacher')
                        }
                    }).catch((error) => {
                        console.error('SAVE API:', error)
                    })
            }
        })
    }

    const handleClickBack = () => {
        navigate('/teacher')
    }


    const isFirstRender = useRef(true)
    useEffect(() => {
        if (isFirstRender.current) {
            getCourseDetail(classId)
            getStudentList(classId)
            isFirstRender.current = false
            return;
        }

        setCountGradeChange(() => {
            const countGradeChangeNow = studentList.filter(student => student.edit_datetime == dateTimeNow)
            return countGradeChangeNow.length
        })

    }, [studentList]);

    return (
        <MainLayout>
            <h2>บันทึกลำดับขั้นแก้ไขอักษร {gradeTypeTitle}</h2>
            <div className='text-secondary d-flex justify-content-between'>
                <h4>{`${courseDetail.courseno} (${courseDetail.seclec}-${courseDetail.seclab}) |  ${courseDetail.course_title}`}</h4>
                <h4>ภาคการศึกษาที่ได้รับเกรด P 1/2565</h4>
            </div>
            {studentList.length ? <Table responsive='xl' bordered hover className='table-fillgrade mt-2'>
                <thead className='tableHead'>
                    <tr className='text-center'>
                        <th className='thead-no'>ที่</th>
                        <th className='thead-student-id'>รหัสนักศึกษา</th>
                        <th className='thead-name'>ชื่อ</th>
                        <th className='thead-surname'>นามสกุล</th>
                        <th className='thead-status'>สถานะการลงทะเบียน</th>
                        <th className='thead-grade-old'>ลำดับขั้นเดิม</th>
                        <th className='thead-grade-new'>ลำดับขั้นที่ได้รับ</th>
                        <th className='thead-edit-by'>บันทึกลำดับขั้นโดย</th>
                        <th className='thead-edit-datetime'>เวลาที่บันทึก</th>
                    </tr>
                </thead>
                <tbody className='tableBody'>
                    {studentList.map((student, index) => {
                        {/* const courseTermTitle = course.yearly ? course.year + " (รายปี)" : course.semester + '/' + course.year
                            const studntAmountTextColor = course.filled_student === course.all_student ? 'text-success' : '' */}
                        const rowNumber = index + 1
                        const enrollStatusCode = student.enroll_status.substring(0, 2)
                        const IsEnrolled = enrollStatusCode != '0_'

                        return (
                            <tr key={student.student_id} className={'tr-' + enrollStatusCode} >
                                <td className='text-center'>{rowNumber}</td>
                                <td className='text-center'>{student.student_id}</td>
                                <td className='text-center'>{student.name}</td>
                                <td className='text-center'>{student.surname}</td>
                                <td className='text-center'>{student.enroll_status_text}</td>
                                <td className='text-center'>{student.grade_old}</td>
                                <td>
                                    <Form.Select onChange={handleGradeChange} disabled={!IsEnrolled} name={student.student_id} value={student.edit_grade}>
                                        {gradeOption.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
                                    </Form.Select>
                                </td>
                                <td className='text-center'>{student.edit_by}</td>
                                <td className='text-center'>{student.edit_datetime}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table> : <NoDataBox msg='No data' />}
            <hr />
            <Row className=' justify-content-end'>
                <Col sm={3}>
                    <div className='d-grid'>
                        <Button variant='success' onClick={handleClickConfirm}>บันทึกลำดับขั้น</Button>
                    </div>
                </Col>
                <Col sm={3}>
                    <div className='d-grid'>
                        <Button variant='outline-secondary' onClick={handleClickBack}>กลับไปก่อนหน้า</Button>
                    </div>
                </Col>
            </Row>
        </MainLayout>
    )
}

export default FillGrade