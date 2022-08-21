import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import {
    Table,
    Button,
    ButtonGroup,
} from 'react-bootstrap';

function FillGrade() {
    const params = useParams()
    const classId = params.classId
    const [studentGradeList, setstudentGradeList] = useState([]);

    const getStudentGrade = async (classId) => {
        // const gradeType = localStorage.getItem('gradeType') ?? false
        const appApiHost = import.meta.env.VITE_API_HOST
        let result
        await axios
            .get(`${appApiHost}/teacher/fill/${classId}`, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
            })
            .then(async (response) => {
                console.log(response.data)
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

    useEffect(() => {
        getStudentGrade(classId)
    }, []);

    return (
        <MainLayout>
            <div className='m-4'>
                {studentGradeList.length ? <Table responsive='xl' bordered hover className='mt-4'>
                    <thead className='tableHead'>
                        <tr className='text-center'>
                            <th>ที่</th>
                            <th>รหัสนักศึกษา</th>
                            <th>ชื่อ</th>
                            <th>สกุล</th>
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
                                    <td className='text-center'>{student.grade_old}</td>
                                    <td>{student.grade_new}</td>
                                    <td className='text-center'>{student.fill_itaccountname}</td>
                                    <td className=''></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table> : '---'}
            </div>
        </MainLayout >
    )
}

export default FillGrade