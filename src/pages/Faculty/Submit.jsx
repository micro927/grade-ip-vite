import '../../styles/table.scss'
// import '../../styles/_global.scss'
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table, Button } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import MainLayout from "../../layouts/MainLayout";
import StepStatusBar from '../../components/StepStatusBar'
import NoDataBox from "../../components/NoDataBox"
import Swal from 'sweetalert2';
import { datetimeTextThai } from '../../utils';

const FacultySubmit = () => {
    const appApiHost = import.meta.env.VITE_API_HOST
    const gradeType = localStorage.getItem('gradeType') ?? false
    const { organization_name_TH } = JSON.parse(localStorage.getItem('loginInfo'))
    const gradeTypeTitle = gradeType.toUpperCase()
    const navigate = useNavigate()
    const location = useLocation()
    const [courseList, setCourseList] = useState([]);

    const getCourseForFaculty = async () => {
        let result
        await axios
            .get(`${appApiHost}/faculty/courselist`, {
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
                    navigate({
                        to: '/' + errorStatus,
                        options: {
                            replace: true
                        }
                    })
                }
                else {
                    console.error('API ERROR : ' + error.code)
                    result = []
                    setCourseList(result)
                }
            })
    }

    const handleClickSubmit = (classId, submissionId) => {
        const { courseno, seclec, seclab, course_title, all_student, filled_student } = courseList.find(c => c.class_id == classId)
        Swal.fire({
            title: `ยืนยันการส่งลำดับขั้น (ระดับคณะ)`,
            html: `
                    กระบวนวิชา: ${courseno} (${seclec}-${seclab})
                    <br>
                    ${course_title}
                `,
            icon: 'question',
            confirmButtonText: 'ยืนยัน',
            showCancelButton: true,
            cancelButtonText: 'ยกเลิก',
            showLoaderOnConfirm: true,
            backdrop: true,
            preConfirm: async () => {
                return await axios
                    .post(`${appApiHost}/faculty/submit/${classId}`, {
                        submissionId
                    }, {
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), }
                    }).then((response) => {
                        return response.data
                    }).catch((error) => {
                        console.log(error.response.data);
                        Swal.showValidationMessage(`Submit API failed`)
                    })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                // const { status, affectedRows } = result.value
                Swal.fire({
                    title: `ยืนยันข้อมูลระดับคณะแล้ว`,
                    icon: 'success',
                    confirmButtonText: 'ตกลง',
                    timer: '3000',
                }).then(() => {
                    window.location.reload()
                })
            }
        })
    }

    const handleClickCancel = (classId, submissionId) => {
        const { courseno, seclec, seclab, course_title, deptuser_submit_itaccountname, deptuser_submit_datetime } = courseList.find(c => c.class_id == classId)
        Swal.fire({
            title: `ยกเลิกการยืนยันกระบวนวิชา ?<br>(ระดับคณะ)`,
            html: `
                    กระบวนวิชา: ${courseno} (${seclec}-${seclab})
                    <br>
                    ${course_title}
                    <br>
                    <br>
                    ผู้ยืนยันลำดับขั้น (ระดับคณะ) : ${deptuser_submit_itaccountname}
                    <br>
                    วันเวลาที่ยืนยัน: ${datetimeTextThai(deptuser_submit_datetime)}
                `,
            icon: 'warning',
            confirmButtonText: 'ยกเลิกการยืนยัน',
            showCancelButton: true,
            cancelButtonText: 'ตรวจสอบอีกครั้ง',
            showLoaderOnConfirm: true,
            backdrop: true,
            preConfirm: async () => {
                return await axios
                    .post(`${appApiHost}/faculty/submitcancel/${classId}`, {
                        submissionId
                    }, {
                        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), }
                    }).then((response) => {
                        return response.data
                    }).catch((error) => {
                        console.log(error.response.data);
                        Swal.showValidationMessage(`Submit API failed`)
                    })
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                // const { status, affectedRows } = result.value
                Swal.fire({
                    title: `ยกเลิกการยืนยันระดับคณะแล้ว`,
                    icon: 'warning',
                    confirmButtonText: 'ตกลง',
                    timer: '3000',
                }).then(() => {
                    window.location.reload()
                })
            }
        })
    }

    useEffect(() => {
        getCourseForFaculty()
    }, []);


    return (
        <MainLayout>
            <h2>ยืนยันลำดับขั้นแก้ไขอักษร {gradeTypeTitle} {organization_name_TH}</h2>
            {courseList.length
                ?
                <>
                    <Table hover responsive='xl' className='mt-4'>
                        <thead className='tableHead'>
                            <tr className='text-center'>
                                <th width='1%'>ที่</th>
                                <th width='10%'>ภาคการศึกษา<br />ที่ได้รับอักษร {gradeTypeTitle}</th>
                                <th width='14%'>รหัสกระบวนวิชา<br />(ตอนบรรยาย - ตอนปฏิบัติการ)</th>
                                <th width='30%'>ชื่อกระบวนวิชา</th>
                                <th width='15%'>สถานะการส่งลำดับขั้นแก้ {gradeTypeTitle}</th>
                                <th width='30%'>การดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody className='tableBody'>
                            {courseList.map((course, index) => {
                                const rowNumber = index + 1
                                const courseLecLab = course.courseno + ' (' + course.seclec + '-' + course.seclab + ')'
                                const courseTermTitle = course.yearly ? course.year + " (รายปี)" : course.semester + '/' + course.year

                                return (
                                    <tr key={course.class_id} >
                                        <td className='text-center'>{rowNumber}</td>
                                        <td className='text-center'>{courseTermTitle}</td>
                                        <td className='text-center'>{courseLecLab}</td>
                                        <td>{course.course_title}</td>
                                        <td><StepStatusBar classData={course} /></td>
                                        <td>
                                            {course?.submit_status > 1
                                                ?
                                                <>
                                                    <div>
                                                        {course?.submit_status == 2 && <Button className='me-2' variant='primary' onClick={() => handleClickSubmit(course.class_id, course.submission_id)}><Icon.Check2Circle /> ยืนยันลำดับขั้น</Button>}
                                                        <Button className='me-2' variant='outline-primary' onClick={() => navigate(`/teacher/fill/${course.class_id}`)}><Icon.CardList /> ดูข้อมูล</Button>
                                                        <Button className='me-2' variant='outline-primary' onClick={() => navigate(`/teacher/cmr54/${course.class_id}`)}> <Icon.FileEarmarkRuled /> CMR54</Button>
                                                        {course?.submit_status == 3 && <Button className='me-2' variant='secondary' onClick={() => handleClickCancel(course.class_id, course.submission_id)}><Icon.XOctagon /> ยกเลิกการยืนยัน</Button>}
                                                    </div>
                                                </>
                                                : ''
                                            }
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </>
                : <NoDataBox msg={"ไม่พบกระบวนวิชาที่ต้องยืนยันลำดับขั้นแก้ไขอักษร " + gradeTypeTitle} />
            }
        </MainLayout>
    )
}

export default FacultySubmit 