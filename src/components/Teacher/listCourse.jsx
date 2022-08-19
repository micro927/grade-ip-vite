import axios from 'axios';
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout'
import * as Icon from 'react-bootstrap-icons';
import {
    Container,
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
        console.log(`${appApiHost}/courses?type=${gradeType}`)
        await axios
            .get(`${appApiHost}/courses`, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
                params: { gradeType: gradeType }
            })
            .then(async (response) => {
                result = await response.data
                console.log(result)
                setCourseList(result)
            })
            .catch((error) => {
                const errorStatus = error.response.status
                if (errorStatus == 401) {
                    window.location.href = '/' + errorStatus
                }
                else {
                    result = ['Something WRONG']
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
                <Table bordered hover className='mt-4'>
                    <thead>
                        <tr className='text-center'>
                            <th>ที่</th>
                            <th>รหัสกระบวนวิชา</th>
                            <th>ตอนบรรยาย</th>
                            <th>ตอนปฏิบัติการ</th>
                            <th>ชื่อกระบวนวิชา</th>
                            <th>ภาคการศึกษาที่ได้รับอักษร {gradeTypeTitle}</th>
                            <th>จำนวนนักศึกษา</th>
                            <th>การดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courseList.map((course, index) => {
                            const courseTermTitle = course.yearly ? course.year + " (รายปี)" : course.semester + '/' + course.year
                            const rowNumber = index + 1

                            return (
                                <tr key={course.class_id} >
                                    <td className='text-center'>{rowNumber}</td>
                                    <td className='text-center'>{course.courseno}</td>
                                    <td className='text-center'>{course.seclec}</td>
                                    <td className='text-center'>{course.seclab}</td>
                                    <td>{course.course_title}</td>
                                    <td className='text-center'>{courseTermTitle}</td>
                                    <td></td>
                                    <td>
                                        <ButtonGroup className="mb-2">
                                            <Button variant='outline-primary'><Icon.FileExcelFill /> กรอกลำดับขั้น</Button>
                                            <Button variant='outline-secondary'>Download Excel</Button>
                                            <Button variant='outline-success'>Upload Excel</Button>
                                            <Button variant='outline-primary'>CMR 54</Button>
                                        </ButtonGroup>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </div>
        </MainLayout>
    )
}

export default ListCourse