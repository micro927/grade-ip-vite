import '../../styles/swal.scss'
// import '../../styles/_global.scss'
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import MainLayout from "../../layouts/MainLayout";
import Swal from 'sweetalert2';
import { datetimeTextThai } from '../../utils';


const AdminVerify = () => {
    const gradeType = localStorage.getItem('gradeType') ?? false
    const gradeTypeTitle = gradeType.toUpperCase()
    const [courseList, setCourseList] = useState([]);
    const [countChecked, setCountChecked] = useState(-1);


    const getCourseForFaculty = async () => {
        const appApiHost = import.meta.env.VITE_API_HOST
        let result
        await axios
            .get(`${appApiHost}/faculty/coursefordeliverlist`, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
                params: { gradeType: gradeType }
            })
            .then(async (response) => {
                result = await response.data
                const courseListWithState = result.map(course => {
                    return {
                        ...course,
                    }
                })
                const fake = courseListWithState.filter(c => c.seclab == '016')
                setCourseList(fake)
                return result

            })
            .catch((error) => {
                const errorStatus = error.response?.status
                if (errorStatus == 401) {
                    navigate('./' + errorStatus)
                }
                else {
                    console.error('API ERROR : ' + error)
                }
            })
    }


    useEffect(() => {
        getCourseForFaculty()
    }, []);


    return (
        <MainLayout>
            <h2 className='text-center'>ยืนยันการส่งลำดับขั้น {gradeTypeTitle}</h2>
            <div className='d-grid'>
                <Form.Group className="mb-3">
                    <Form.Label>กรุณาสแกนบาร์โค้ด</Form.Label>
                    <Form.Control type="email" placeholder="Enter Submission Code" />
                </Form.Group>
                <Button size='lg' variant='primary'>คลิกหรือแสกนเพื่อยืนยัน</Button>
            </div>
            <hr />
            <h4 className='mt-5 text-center'>รายการที่ยืนยันการแก้ไขล่าสุด</h4>
            <Table size='sm' hover bordered responsive='xl' className='mt-4'>
                <thead className='tableHead'>
                    <tr className='text-center'>
                        <th>รหัสรายการ</th>
                        <th>รหัสกระบวนวิชา</th>
                        <th>ตอนบรรยาย</th>
                        <th>ตอนปฏิบัติการ</th>
                        <th>ชื่อกระบวนวิชา</th>
                        <th>ผู้ยืนยันรายการ</th>
                        <th>วันเวลาที่ดำเนินรายการ</th>
                    </tr>
                </thead>
                <tbody className='tableBody'>
                    {courseList.map((course, index) => {
                        return (
                            <tr key={course.class_id} >
                                <td className='text-center'>000001</td>
                                <td className='text-center'>{course.courseno}</td>
                                <td className='text-center'>{course.seclec}</td>
                                <td className='text-center'>{course.seclab}</td>
                                <td className='text-center'>{course.course_title}</td>
                                <td className='text-center'>{course.facuser_submit_itaccountname}</td>
                                <td className='text-center'>{datetimeTextThai(course.facuser_submit_datetime)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

        </MainLayout>
    )
}

export default AdminVerify