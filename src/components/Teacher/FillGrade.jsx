import './index.scss'
import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import * as Icon from 'react-bootstrap-icons';
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
import NodataBox from '../NoDataBox';

function FillGrade() {
    const gradeType = localStorage.getItem('gradeType') ?? false
    const gradeTypeTitle = gradeType.toUpperCase()
    const params = useParams()
    const appApiHost = import.meta.env.VITE_API_HOST
    const classId = params.classId
    const [studentGradeList, setstudentGradeList] = useState([]);
    const [courseDetail, setCourseDetail] = useState([]);

    const gradeOption = [
        ['A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'],
        ['S', 'U']
    ]

    const getStudentGrade = async (classId) => {

        let result
        await axios
            .get(`${appApiHost}/teacher/fill/${classId}`, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
            })
            .then(async (response) => {
                // console.log(response.data)
                result = await response.data
                setstudentGradeList(result)
            })
            .catch((error) => {
                const errorStatus = error.response.status
                if (errorStatus == 403) {
                    window.location.href = '/' + errorStatus
                }
                else {
                    console.error('API ERROR : ' + error.code)
                    result = []
                    setstudentGradeList(result)
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
        Swal.fire('TEST')
    }



    useEffect(() => {
        getStudentGrade(classId)
        getCourseDetail(classId)
    }, []);

    return (
        <MainLayout>
            <div className='m-4'>
                <h2>บันทึกลำดับขั้นแก้ไขอักษร {gradeTypeTitle}</h2>
                <div className='text-secondary d-flex justify-content-between'>
                    <h4>{`${courseDetail.courseno} (${courseDetail.seclec}-${courseDetail.seclab})  ${courseDetail.course_title}`}</h4>
                    <h4>ภาคการศึกษาที่ได้รับเกรด P 1/2565</h4>
                </div>

                {studentGradeList.length ? <Table responsive='xl' bordered hover className='mt-4'>
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
                        {studentGradeList.map((student, index) => {
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
                                        <Form.Select>
                                            {gradeOption[courseDetail.grade_id].map((grade) => {
                                                return (
                                                    <option key={grade} value={grade}>{grade}</option>
                                                )

                                            })}
                                        </Form.Select>
                                    </td>
                                    <td className='text-center'>{student.fill_itaccountname}</td>
                                    <td className=''></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table> : <NodataBox msg='Error' />}
                <hr />
                <Row className=' justify-content-end'>
                    <Col sm={3}>
                        <div className='d-grid'>
                            <Button variant='success' onClick={handleClickConfirm}>บันทึกลำดับขั้น</Button>
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div className='d-grid'>
                            <Button variant='outline-secondary'>กลับหน้าแรก</Button>
                        </div>
                    </Col>
                </Row>

            </div>
        </MainLayout>
    )
}

export default FillGrade