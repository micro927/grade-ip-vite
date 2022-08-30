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

function GradeSelect(props) {
    const [isChangeGrade, setIsChangeGrade] = useState('')
    const gradeOptionList = [
        ['', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'],
        ['', 'S', 'U']
    ]
    const gradeOption = gradeOptionList[props.gradeId ?? 0]
    // let gradeSelectClass = ''
    function handleGradeChange(e) {
        setIsChangeGrade(e.target.value == (props.gradeNow ?? '') ? '' : 'border-primary')
        props.ongradeChange()
    }
    return (
        <Form.Select className={isChangeGrade} onChange={handleGradeChange} defaultValue={props.gradeNow}>
            {gradeOption.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
        </Form.Select>
    )
}

function FillGrade() {
    const gradeType = localStorage.getItem('gradeType') ?? false
    const gradeTypeTitle = gradeType.toUpperCase()
    const params = useParams()
    const appApiHost = import.meta.env.VITE_API_HOST
    const classId = params.classId
    const [studentList, setstudentList] = useState([]);
    const [courseDetail, setCourseDetail] = useState([]);
    const navigate = useNavigate()

    const getStudentGrade = async (classId) => {
        let result
        await axios
            .get(`${appApiHost}/teacher/fill/${classId}`, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
            })
            .then(async (response) => {
                // console.log(response.data)
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

    const handleClickConfirm = () => {
        Swal.fire({
            title: 'TEST',
            showCancelButton: true,
        })
    }

    const handleClickBack = () => {
        navigate(-1)
    }


    useEffect(() => {
        getCourseDetail(classId)
        getStudentGrade(classId)
    }, []);

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
                        <th>สกุล</th>
                        <th>สถานะการลงทะเบียน</th>
                        <th>ลำดับขั้นเดิม</th>
                        <th>ลำดับขั้นที่ได้รับ</th>
                        <th>บันทึกลำดับขั้นโดย</th>
                        <th>ช่องทางการบันทึก</th>
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
                                    <GradeSelect ongradeChange={() => console.log('555555555555555555555')} gradeOption={courseDetail.grade_id} gradeNow={student.grade_new} />
                                </td>
                                <td className='text-center'>{student.fill_itaccountname}</td>
                                <td className=''></td>
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