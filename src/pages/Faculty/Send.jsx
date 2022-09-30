import '../../styles/swal.scss'
// import '../../styles/_global.scss'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Form } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import axios from 'axios';
import MainSidebarLayout from "../../layouts/MainSidebarLayout";
import NoDataBox from "../../components/NoDataBox"
import Swal from 'sweetalert2';
import { datetimeTextThai } from '../../utils';


const FacultySend = () => {
    const gradeType = localStorage.getItem('gradeType') ?? false
    const { organization_name_TH } = JSON.parse(localStorage.getItem('loginInfo'))
    const gradeTypeTitle = gradeType.toUpperCase()
    const navigate = useNavigate()
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
                        isChecked: false
                    }
                })
                setCourseList(courseListWithState)
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

    const handleClickRow = (position) => {
        let newCourseList = [...courseList]
        newCourseList[position].isChecked = !courseList[position].isChecked
        setCourseList(newCourseList)
    }

    const handleCheck = (position) => {
        let newCourseList = [...courseList]
        newCourseList[position].isChecked = !courseList[position].isChecked
        setCourseList(newCourseList)
    }

    const handleCheckAll = () => {
        const newCourseList = courseList.map((c) => {
            return {
                ...c,
                isChecked: true
            }
        })
        setCourseList(newCourseList)
    }

    const handleUncheckAll = () => {
        const newCourseList = courseList.map((c) => {
            return {
                ...c,
                isChecked: false
            }
        })
        setCourseList(newCourseList)
    }

    const handleSendClick = () => {
        if (countChecked > 0) {
            Swal.fire({
                title: `ยืนยันการนำส่งลำดับขั้น<br>จำนวน ${countChecked} กระบวนวิชา`,
                icon: 'question',
                confirmButtonText: 'ยืนยันการนำส่ง',
                showCancelButton: true,
                cancelButtonText: 'ตรวจสอบอีกครั้ง',
            }).then(() => {
                Swal.fire(
                    {
                        title: 'นำส่งสำเร็จแล้ว',
                        html: `จำนวน ${countChecked} กระบวนวิชา`,
                        icon: 'success'
                    })
            })
        }
    }

    const handleClickDeliver = (deliverId) => {
        Swal.fire({
            title: 'รหัสการนำส่ง 0000001 (1 รายการ)',
            width: '70vw',
            confirmButtonText: `พิมพ์ใบนำส่ง`,
            showCancelButton: true,
            cancelButtonText: `ปิด`,
            html: `
    <hr />
    <table class='table table-bordered'>
        <thead>
            <tr>
                <th>ที่</th>
                <th>ภาคการศึกษา<br />ที่ได้รับอักษร ${gradeTypeTitle}</th>
                <th>รหัสกระบวนวิชา<br />(ตอนบรรยาย - ตอนปฏิบัติการ)</th>
                <th>ชื่อกระบวนวิชา</th>
                <th>เจ้าหน้าที่คณะที่นำส่ง</th>
                <th>เวลาที่นำส่ง</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>2/2564</td>
                <td>001489 (000-016)</td>
                <td>INDEPENDENT STUDY</td>
                <td>sitthiphon.s</td>
                <td>2022-09-30 21:23:24</td>
            </tr></tbody>
    </table>
`
        })
    }

    useEffect(() => {
        getCourseForFaculty()
    }, []);

    useEffect(() => {
        setCountChecked(() => {
            const count = courseList.filter(c => c.isChecked == true).length
            return count
        })
    }, [courseList]);


    return (
        <MainSidebarLayout sidebarContent={<div className='mt-4'>
            <h5 className='text-secondary'>ประวัติการนำส่ง</h5>
            <hr />
            <h6 onClick={() => handleClickDeliver(1)}>2022-09-30 21:23:24 (1 รายการ)</h6>
        </div>}>
            <h2>นำส่งลำดับขั้นแก้ไขอักษร {gradeTypeTitle} {organization_name_TH}</h2>
            {courseList.length
                ?
                <>
                    <div className='d-flex justify-content-end gap-2'>
                        <Button size='lg' variant='success' disabled={countChecked < 1} onClick={handleSendClick}>นำส่งกระบวนวิชาที่เลือก {countChecked} กระบวนวิชา</Button>
                    </div>
                    <Form>
                        <Table size='sm' hover responsive='xl' className='mt-4'>
                            <thead className='tableHead'>
                                <tr className='text-center'>
                                    <th>เลือก</th>
                                    <th>ที่</th>
                                    <th>ภาคการศึกษา<br />ที่ได้รับอักษร {gradeTypeTitle}</th>
                                    <th>รหัสกระบวนวิชา<br />(ตอนบรรยาย - ตอนปฏิบัติการ)</th>
                                    <th>ชื่อกระบวนวิชา</th>
                                    <th>จำนวนนักศึกษา<br />ที่แก้ไขลำดับขั้น</th>
                                    <th>เจ้าหน้าที่คณะที่ยืนยัน</th>
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
                                            <td className='text-center'>
                                                <Form.Check
                                                    type='checkbox'
                                                    id={`checkbox - ${course.class_id} `}
                                                    name={course.classId}
                                                    value={course.classId}
                                                    checked={course.isChecked}
                                                    onChange={e => handleCheck(index)}
                                                />
                                            </td>
                                            <td style={{ cursor: 'pointer' }} onClick={() => { handleClickRow(index) }} className='text-center'>{rowNumber}</td>
                                            <td style={{ cursor: 'pointer' }} onClick={() => { handleClickRow(index) }} className='text-center'>{courseTermTitle}</td>
                                            <td style={{ cursor: 'pointer' }} onClick={() => { handleClickRow(index) }} className=''>{courseLecLab}</td>
                                            <td style={{ cursor: 'pointer' }} onClick={() => { handleClickRow(index) }} className=''>{course.course_title}</td>
                                            <td style={{ cursor: 'pointer' }} onClick={() => { handleClickRow(index) }} className='text-center'>{course.all_student}/{course.filled_student}</td>
                                            <td style={{ cursor: 'pointer' }} onClick={() => { handleClickRow(index) }} >{course.facuser_submit_itaccountname} ({datetimeTextThai(course.facuser_submit_datetime)})</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </Table>
                    </Form>
                    <div className='d-flex justify-content-end gap-2'>
                        {countChecked > 0 && countChecked == courseList.length
                            ?
                            <Button variant='outline-secondary' className='px-4' onClick={handleUncheckAll}><Icon.DashSquare /> ไม่เลือกทั้งหมด</Button>
                            :
                            <Button variant='outline-secondary' className='px-4' onClick={handleCheckAll}><Icon.CardChecklist /> เลือกทั้งหมด</Button>
                        }
                    </div>
                    <div className='my-5'>
                        <hr />
                    </div>
                    <div>
                        <h2>กระบวนวิชาที่นำส่งแล้ว</h2>
                        <Table size='sm' hover responsive='xl' className='mt-4'>
                            <thead className='tableHead'>
                                <tr className='text-center'>
                                    <th>ที่</th>
                                    <th>ภาคการศึกษา<br />ที่ได้รับอักษร {gradeTypeTitle}</th>
                                    <th>รหัสกระบวนวิชา<br />(ตอนบรรยาย - ตอนปฏิบัติการ)</th>
                                    <th>ชื่อกระบวนวิชา</th>
                                    <th>เจ้าหน้าที่คณะที่นำส่ง</th>
                                    <th>เวลาที่นำส่ง</th>
                                </tr>
                            </thead>
                        </Table>
                    </div>
                </>
                : <NoDataBox msg={"ไม่พบกระบวนวิชาที่พร้อมนำส่ง"} />
            }
        </MainSidebarLayout>
    )
}

export default FacultySend