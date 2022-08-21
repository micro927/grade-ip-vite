import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import MainLayout from '../../layouts/MainLayout'
import * as Icon from 'react-bootstrap-icons';
import './index.scss'

import {
    Table,
    Button,
    ButtonGroup,
} from 'react-bootstrap';

const ListCourse = () => {
    const [courseList, setCourseList] = useState([]);
    const gradeType = localStorage.getItem('gradeType') ?? false
    const gradeTypeTitle = gradeType.toUpperCase()


    const getCourseForTeacher = async () => {
        const appApiHost = import.meta.env.VITE_API_HOST
        let result
        await axios
            .get(`${appApiHost}/teacher/courselist`, {
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

    useEffect(() => {
        getCourseForTeacher()
    }, []);

    return (
        <MainLayout>
            <div className='m-4'>
                <h2>บันทึกลำดับขั้นแก้ไขอักษร {gradeTypeTitle}</h2>
                {courseList.length ? <Table responsive='xl' bordered hover className='mt-4'>
                    <thead className='tableHead'>
                        <tr className='text-center'>
                            <th>ที่</th>
                            <th>รหัสกระบวนวิชา</th>
                            <th>ตอนบรรยาย</th>
                            <th>ตอนปฏิบัติการ</th>
                            <th>ชื่อกระบวนวิชา</th>
                            <th>ภาคการศึกษา<br />ที่ได้รับอักษร {gradeTypeTitle}</th>
                            <th>แก้ไขอักษร<br />ลำดับขั้นแล้ว (ราย)</th>
                            <th>การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody className='tableBody'>
                        {courseList.map((course, index) => {
                            const courseTermTitle = course.yearly ? course.year + " (รายปี)" : course.semester + '/' + course.year
                            const rowNumber = index + 1
                            const studntAmountTextColor = course.filled_student === course.all_student ? 'text-success' : ''

                            return (
                                <tr key={course.class_id} >
                                    <td className='text-center'>{rowNumber}</td>
                                    <td className='text-center'>{course.courseno}</td>
                                    <td className='text-center'>{course.seclec}</td>
                                    <td className='text-center'>{course.seclab}</td>
                                    <td>{course.course_title}</td>
                                    <td className='text-center'>{courseTermTitle}</td>
                                    <td className={'text-center ' + studntAmountTextColor}>{course.filled_student + "/" + course.all_student}</td>
                                    <td>
                                        <ButtonGroup>
                                            <Button variant='outline-primary'><Link to={'fill/' + course.class_id} style={{ textDecoration: 'none' }}><Icon.KeyboardFill /> กรอกลำดับขั้น</Link></Button>
                                            <Button variant='outline-secondary'><Icon.FileEarmarkArrowDown /> Download Excel</Button>
                                            <Button variant='outline-success'><Icon.FileEarmarkArrowUpFill /> Upload Excel</Button>
                                            <Button variant='outline-primary'><Icon.FileEarmarkRuled /> CMR 54</Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table> : <div className='text-center mt-4'>
                    <hr />
                    <h2 >ไม่พบกระบวนวิชาที่ต้องแก้ไขอักษร {gradeTypeTitle}</h2>
                    <Button variant='outline-secondary' href='./'>กลับไปหน้าแรก</Button>
                </div>}
            </div>
        </MainLayout>
    )
}

export default ListCourse