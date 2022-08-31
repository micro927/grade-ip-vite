import '../../styles/swal.scss'
// import '../../styles/_global.scss'
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import MainSidebarLayout from "../../layouts/MainSidebarLayout";
import NoDataBox from "../../components/NoDataBox"
import Swal from 'sweetalert2';
import { Prev } from 'react-bootstrap/esm/PageItem';


const FacultySend = () => {
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

    const handleSendClick = () => {
        Swal.fire({
            title: `ยืนยันการนำส่งลำดับขั้นที่เลือก`,
            icon: 'question',
            confirmButtonText: 'ยืนยัน',
            showCancelButton: true,
            cancelButtonText: 'ตรวจสอบอีกครั้ง',
        })
    }

    useEffect(() => {
        getCourseForFaculty()
    }, []);


    return (
        <MainSidebarLayout sidebarContent={<div className='mt-4'>
            <h5 className='text-secondary'>ประวัติการนำส่ง</h5>
            <h3></h3>
        </div>}>
            <h2>นำส่งลำดับขั้นแก้ไขอักษร {gradeTypeTitle}</h2>
            {courseList.length
                ?
                <>
                    <div className='d-flex justify-content-end gap-2'>
                        <Button variant='outline-primary'>เลือกทั้งหมด</Button>
                        <Button variant='primary' onClick={handleSendClick}>นำส่งกระบวนวิชาที่เลือก</Button>
                    </div>
                    <Table size='sm' hover responsive='xl' className='mt-4'>
                        <thead className='tableHead'>
                            <tr className='text-center'>
                                <th>เลือก</th>
                                <th>รหัสกระบวนวิชา</th>
                                <th>ตอนบรรยาย</th>
                                <th>ตอนปฏิบัติการ</th>
                                <th>ภาคการศึกษา<br />ที่ได้รับอักษร {gradeTypeTitle}</th>
                                <th>จำนวนนักศึกษา<br />ทั้งหมด</th>
                                <th>ส่งเกรด</th>
                                <th>หมายเหตุ</th>
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
                                    <tr ref={ref} thisclassid={course.class_id} onClick={() => { handleClickRow(course.class_id) }} key={course.class_id} >
                                        <td className='text-center'>
                                            <Form.Check
                                                type='checkbox'
                                                thisclassid={course.class_id}
                                                value={sendCourseState[course.class_id]}
                                                id={`checkbox-${course.class_id}`}
                                                onChange={e => handleCheck(e.target.checked, course.class_id)}
                                            />
                                        </td>
                                        <td className='text-center'>{course.courseno} {course.class_id}</td>
                                        <td className='text-center'>{course.seclec}</td>
                                        <td className='text-center'>{course.seclab}</td>
                                        <td className='text-center'>{courseTermTitle}</td>
                                        <td className='text-center'>{course.all_student}</td>
                                        <td className='text-center'>{course.filled_student}</td>
                                        <td></td>
                                        <td>{course.deptuser_submit_itaccountname}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>
                </>
                : <NoDataBox msg={"ไม่พบกระบวนวิชาที่ต้องยืนยันลำดับขั้นแก้ไขอักษร" + gradeTypeTitle} />
            }
        </MainSidebarLayout>
    )
}

export default FacultySend