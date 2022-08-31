import '../../styles/swal.scss'
// import '../../styles/_global.scss'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import MainLayout from "../../layouts/MainLayout";
import NoDataBox from "../../components/NoDataBox"
import Swal from 'sweetalert2';


const FacultySubmit = () => {
    const gradeType = localStorage.getItem('gradeType') ?? false
    const gradeTypeTitle = gradeType.toUpperCase()
    const navigate = useNavigate()
    const [courseList, setCourseList] = useState([]);

    const getCourseForFaculty = async () => {
        const appApiHost = import.meta.env.VITE_API_HOST
        let result
        await axios
            .get(`${appApiHost}/department/courselist`, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
                params: { gradeType: gradeType }
            })
            .then(async (response) => {
                result = await response.data
                setCourseList(result)
            })
            .catch((error) => {
                const errorStatus = error.response.status
                if (errorStatus == 401) {
                    window.location.href = '/' + errorStatus
                }
                else {
                    console.error('API ERROR : ' + error.code)
                    result = []
                    setCourseList(result)
                }
            })
    }

    const handleClickSubmit = (classId) => {
        Swal.fire({
            title: `ยืนยันการส่งลำดับขั้น ${classId} ?`,
            confirmButtonText: 'ยืนยัน',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
        })
    }

    useEffect(() => {
        getCourseForFaculty()
    }, []);


    return (
        <MainLayout>
            <h2>ยืนยันลำดับขั้นแก้ไขอักษร {gradeTypeTitle} ระดับคณะ</h2>
            {courseList.length
                ?
                <>
                    <Table hover responsive='xl' className='mt-4'>
                        <thead className='tableHead'>
                            <tr className='text-center'>
                                <th>ที่</th>
                                <th>รหัสกระบวนวิชา<br />(ตอนบรรยาย - ตอนปฏิบัติการ)</th>
                                <th>ชื่อกระบวนวิชา</th>
                                <th>ภาคการศึกษา<br />ที่ได้รับอักษร {gradeTypeTitle}</th>
                                <th>สถานะการกรอก<br />อักษรลำดับขั้น</th>
                                <th>ผู้กรอก<br />อักษรลำดับขั้น</th>
                                <th>ผู้ยืนยัน<br />ระดับภาควิชา</th>
                                <th>ผู้ยืนยัน<br />ระดับคณะ</th>
                                <th>การดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody className='tableBody'>
                            {courseList.map((course, index) => {
                                const rowNumber = index + 1
                                const courseLecLab = course.courseno + ' (' + course.seclec + '-' + course.seclab + ')'
                                const courseTermTitle = course.yearly ? course.year + " (รายปี)" : course.semester + '/' + course.year
                                const studntAmountTextColor = course.filled_student === course.all_student ? 'text-success' : ''
                                const isShowAction = course.deptuser_submit_itaccountname == null

                                return (
                                    <tr key={course.class_id} >
                                        <td className='text-center'>{rowNumber}</td>
                                        <td className='text-center'>{courseLecLab}</td>
                                        <td>{course.course_title}</td>
                                        <td className='text-center'>{courseTermTitle}</td>
                                        <td className={'text-center ' + studntAmountTextColor}>กรอกแล้ว {course.filled_student + "/" + course.all_student} ราย</td>
                                        <td></td>
                                        <td></td>
                                        <td>{course.deptuser_submit_itaccountname}</td>
                                        <td>
                                            {course.is_fill == 1
                                                ?
                                                <>
                                                    {isShowAction
                                                        ?
                                                        <Button size='sm' variant='success' onClick={() => handleClickSubmit(course.class_id)}><Icon.Check2Circle /> ยืนยันลำดับขั้นกระบวนวิชานี้</Button>
                                                        : <span className='text-secondary'>ยืนยันแล้ว</span>}
                                                    {' '}<Button size='sm' variant='outline-primary'> <Icon.FileEarmarkRuled /> CMR54</Button>
                                                </>
                                                : <span className='text-secondary'>ยังไม่ได้ยืนยันจากภาควิชา</span>
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </>
                : <NoDataBox msg={"ไม่พบกระบวนวิชาที่ต้องยืนยันลำดับขั้นแก้ไขอักษร" + gradeTypeTitle} />
            }
        </MainLayout>
    )
}

export default FacultySubmit