import '../../styles/swal.scss'
// import '../../styles/_global.scss'
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import MainLayout from "../../layouts/MainLayout";
import NoDataBox from "../../components/NoDataBox"
import Swal from 'sweetalert2';
import { Prev } from 'react-bootstrap/esm/PageItem';


const AdminVerify = () => {
    const gradeType = localStorage.getItem('gradeType') ?? false
    const gradeTypeTitle = gradeType.toUpperCase()
    const navigate = useNavigate()
    const ref = useRef()
    const [courseList, setCourseList] = useState([]);
    const [sendCourseState, setSendCourseState] = useState({});

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
                // console.log('rrrrrrrrrrrrr');
                return result

            })
            .then((result) => {
                createSendState(result)
            })
            .catch((error) => {
                const errorStatus = error.response?.status
                if (errorStatus == 401) {
                    window.location.href = '/' + errorStatus
                }
                else {
                    console.error('API ERROR : ' + error)
                    result = []
                    setCourseList(result)
                }
            })
    }

    const createSendState = (courseList) => {
        let courseState = {}
        courseList.map(course => {
            // console.log('bbbb', course.class_id);
            courseState[course.class_id] = true
        }
        )
        setSendCourseState(courseState)
    }

    const handleClickRow = (classId) => {
        // setSendCourseState(prevState => {
        //     console.log(prevState);
        //     const newState = prevState
        //     newState[classId] = !prevState[classId]
        //     return newState
        // })
        // setSendCourseState(prevState => ({
        //     sendCourseState: {
        //         ...prevState,
        //         [prevState[class_id]]: !([prevState[class_id])
        //     }
        // }))
        // Swal.fire({
        //     title: `ยืนยันการส่งลำดับขั้น ${e.target} ?`,
        //     confirmButtonText: 'ยืนยัน',
        //     showCancelButton: true,
        //     cancelButtonText: 'ยกเลิก',
        // })
    }

    const handleCheck = (value, classId) => {
        // console.log(value);
        // setSendCourseState(prevState => {
        //     console.log(prevState);
        //     const newState = prevState
        //     newState[classId] = value
        //     return newState
        // })
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
                <Button variant='primary'>คลิกหรือแสกนเพื่อยืนยัน</Button>
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
                        <th>ผู้ยืนยันรายการ</th>
                        <th>วันเวลาที่ดำเนินรายการ</th>
                    </tr>
                </thead>
                <tbody className='tableBody'>
                </tbody>
            </Table>

        </MainLayout>
    )
}

export default AdminVerify