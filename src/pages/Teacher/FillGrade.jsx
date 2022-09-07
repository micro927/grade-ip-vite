import '../../styles/table.scss'
import { useState, useEffect } from 'react';
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
    const navigate = useNavigate()

    const [studentList, setstudentList] = useState([]);
    const [gradeOption, setGradeOption] = useState([]);
    const [courseDetail, setCourseDetail] = useState([]);

    const getCourseDetail = async (classId) => {
        let result
        await axios
            .get(`${appApiHost}/teacher/coursedetail/${classId}`, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
            })
            .then(async (response) => {
                // console.log(response.data)
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
                const errorStatus = error.response.status
                if (errorStatus == 403) {
                    window.location.href = '/' + errorStatus
                }
                else {
                    console.error('API ERROR : ' + error.code)
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
                setstudentList(result)
            })
            .catch((error) => {
                const errorStatus = error.response.status
                if (errorStatus == 403) {
                    window.location.href = '/' + errorStatus
                }
                else {
                    console.error('API ERROR : ' + error.code)
                    result = []
                    setstudentList(result)
                }
            })
    }

    useEffect(() => {
        getCourseDetail(classId)
        getStudentList(classId)
    }, []);

    const handleGradeChange = (event) => {
        const studentId = event.target.name
        const grade = event.target.value
        const dateTimeNow = '*กำลังแก้ไข*' //new Date().toLocaleString()
        setstudentList(prevList => {
            const newList = prevList.map((row) => {
                if (row.student_id == studentId) {
                    const thisEditGrade = grade
                    const thisEditBy = row.grade_new != thisEditGrade ? userCmuItAccountName : row.fill_itaccountname
                    const thisEditdatetime = row.grade_new != thisEditGrade ? dateTimeNow : row.fill_datetime
                    return { ...row, edit_grade: thisEditGrade, edit_by: thisEditBy, edit_datetime: thisEditdatetime }
                }
                else {
                    return { ...row }
                }
            })
            return newList
        })
    }

    const handleClickConfirm = () => {
        Swal.fire({
            title: 'TEST',
            showCancelButton: true,
        })
    }

    const handleClickBack = () => {
        navigate(-1)
    }

    return (
        <MainLayout>
            <h2>บันทึกลำดับขั้นแก้ไขอักษร {gradeTypeTitle}</h2>
            <div className='text-secondary d-flex justify-content-between'>
                <h4>{`${courseDetail.courseno} (${courseDetail.seclec}-${courseDetail.seclab}) |  ${courseDetail.course_title}`}</h4>
                <h4>ภาคการศึกษาที่ได้รับเกรด P 1/2565</h4>
            </div>
            {studentList.length ? <Table responsive='xl' bordered hover className='mt-2'>
                <thead className='tableHead'>
                    <tr className='text-center'>
                        <th>ที่</th>
                        <th>รหัสนักศึกษา</th>
                        <th>ชื่อ</th>
                        <th>นามสกุล</th>
                        <th>สถานะการลงทะเบียน</th>
                        <th>ลำดับขั้นเดิม</th>
                        <th>ลำดับขั้นที่ได้รับ</th>
                        <th>บันทึกลำดับขั้นโดย</th>
                        <th>เวลาที่บันทึก</th>
                    </tr>
                </thead>
                <tbody className='tableBody'>
                    {studentList.map((student, index) => {
                        {/* const courseTermTitle = course.yearly ? course.year + " (รายปี)" : course.semester + '/' + course.year
                            const studntAmountTextColor = course.filled_student === course.all_student ? 'text-success' : '' */}
                        const rowNumber = index + 1

                        return (
                            <tr key={student.student_id} >
                                <td className='text-center'>{rowNumber}</td>
                                <td className='text-center'>{student.student_id}</td>
                                <td className='text-center'>{student.name}</td>
                                <td className='text-center'>{student.surname}</td>
                                <td className='text-center'>{student.enroll_status}</td>
                                <td className='text-center'>{student.grade_old}</td>
                                <td>
                                    <Form.Select onChange={handleGradeChange} name={student.student_id} value={student.edit_grade}>
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