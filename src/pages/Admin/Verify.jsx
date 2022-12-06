import '../../styles/swal.scss'
// import '../../styles/_global.scss'
import { useState, useEffect, useRef } from "react";
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
    const appApiHost = import.meta.env.VITE_API_HOST
    const deliverRowLimit = 10


    const getVerifiedList = async () => {
        let result
        await axios
            .get(`${appApiHost}/admin/verifiedList`, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
                params: { gradeType, deliverRowLimit }
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

    const submitDeliverId = (deliverId) => {
        if (deliverId.length == 32) {
            axios
                .post(`${appApiHost}/admin/submit`, {
                    deliverId
                }, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), }
                }).then((response) => {
                    const statusIcon = response.data.affectedRows > 0 ? 'success' : 'error'
                    console.log(response.data)
                    Swal.fire({
                        toast: true,
                        position: 'top-end',
                        icon: statusIcon,
                        title: `ยืนยันการนำส่ง ${response.data.affectedRows} รายการ`,
                        showConfirmButton: false,
                        timer: '1000',
                        timerProgressBar: true,
                    }).then(() => window.location.reload())
                })
                .catch((error) => {
                    console.log(error.response.data);
                    Swal.fire(`Submit API failed`)
                })
        }
        else {
            console.log(deliverId);
        }
    }

    useEffect(() => {
        getVerifiedList()
    }, []);

    return (
        <MainLayout>
            <h2 className='text-center'>ยืนยันการส่งลำดับขั้น {gradeTypeTitle}</h2>

            <div className='d-grid'>
                <Form.Group className="mb-3">
                    <Form.Label>กรุณาสแกนบาร์โค้ด</Form.Label>
                    <Form.Control autoFocus type="text" onChange={e => submitDeliverId(e.target.value)} placeholder="Enter Deliver Code" />
                </Form.Group>
                <Button size='lg' variant='primary' disabled>แสกนเพื่อยืนยัน</Button>
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
                        const rowNo = index + 1
                        return (
                            <tr key={course.class_id} >
                                <td className='text-center'>{rowNo}</td>
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