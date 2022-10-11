import './index.scss'
import '../../styles/table.scss'
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import * as Icon from 'react-bootstrap-icons';
import {
    Table,
    Button,
    ButtonGroup,

} from 'react-bootstrap';
import { AppContext } from '../../components/Provider';
import axios from 'axios';
import readXlsxFile from 'read-excel-file/web-worker'
import MainLayout from '../../layouts/MainLayout'
import FileUploaderButton from '../../components/FileUploaderButton';
import Swal from 'sweetalert2';
import { getAllSubmitStatusTitle } from '../../utils';

const ListCourse = () => {
    const appApiHost = import.meta.env.VITE_API_HOST
    const { AppThisSemester, AppThisYear } = useContext(AppContext)
    const [courseList, setCourseList] = useState([]);
    const gradeType = localStorage.getItem('gradeType') ?? false
    const gradeTypeTitle = gradeType.toUpperCase()
    const navigate = useNavigate()
    const allSubmitStatusTitle = getAllSubmitStatusTitle()
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

                setCourseList(() => {
                    const courseListEdited = result.map((course) => {
                        const courseTermTitle = course.yearly ? course.year + " (รายปี)" : course.semester + '/' + course.year
                        const isAllfilled = course.filled_student === course.all_student
                        const submitStatus = isAllfilled
                            ? course.submit_status
                            : 'wait_fill'
                        return {
                            ...course,
                            courseTermTitle,
                            isAllfilled,
                            submitStatus,
                        }
                    })
                    return courseListEdited
                })
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

    const onClickFillMenu = (classId) => {
        navigate('fill/' + classId)
    }

    const onClickDownload = async (classId, option = 1) => {
        await axios
            .get(`${appApiHost}/teacher/exceldownload/${classId}`, {
                responseType: 'blob', // important
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
                params: { gradeType: gradeType }
            })
            .then(async (response) => {
                const href = URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', AppThisSemester + AppThisYear + '-' + classId + '.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
            })
            .catch((error) => {
                console.log('api download: ', error);
            })
    }

    const onClickCMR = async (classId) => {
        await axios
            .get(`${appApiHost}/teacher/cmr541/${classId}`, {
                responseType: 'blob', // important
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken'), },
            }).then((response) => {
                const href = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', AppThisSemester + AppThisYear + '-' + classId + '.pdf');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link)
                URL.revokeObjectURL(href);

            })
            .catch((error) => {
                console.log('cmr54 download: ', error);
            })
    }

    const onFileUploaded = (file, uploadId) => {
        readXlsxFile(file).then(async (rows) => {
            const classId = uploadId
            const classIdpartClicked = classId.substr(5, 12)
            const gradeType = classId.substr(-1)
            const courseNo = rows?.[1]?.[2] ?? ''
            const secLecLab = rows?.[3]?.[2] ?? ''
            const classIdpartForCheck = courseNo + secLecLab.replace('/', '')

            if (classIdpartClicked !== classIdpartForCheck) {
                return Swal.fire({
                    title: 'พบข้อผิดพลาด',
                    icon: 'warning',
                    html: `ไฟล์ที่ท่านอัพโหลดไม่ตรงกับกระบวนวิชาที่ท่านเลือก`
                })
            }
            else {
                const dataList = rows.slice(7, rows.length)
                const dataForSave = dataList.map((row) => {
                    return {
                        student_id: row[1],
                        name: row[2],
                        surname: row[3],
                        enroll_status: 0,
                        grade_old: gradeType,
                        grade_new: row[4],
                        fill_itaccountname: 0,
                        fill_datetime: 0,
                        edit_grade: row[4],
                        edit_by: 0,
                        edit_datetime: 0
                    }
                })

                Swal.fire({
                    icon: 'question',
                    title: 'ยืนยันการนำเข้าลำดับขั้น ?',
                    html: `นำเข้าลำดับขั้นจากไฟล์ Excel<br>
                    กระบวนวิชา ${courseNo} (${secLecLab})<br>
                            จำนวนนักศึกษา ${dataForSave.length} ราย`,
                    showCancelButton: true,
                    confirmButtonText: 'นำเข้าลำดับขั้น',
                    cancelButtonText: 'ยกเลิก',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate(`./fill/${classId}`,
                            {
                                state: {
                                    dataForSave
                                }
                            }
                        )
                    }
                })
            }
            // navigate

            // console.log(rows);
            // `rows` is an array of rows
            // each row being an array of cells.
        }).catch((error) => {
            console.log(error);
            Swal.fire({
                title: 'พบข้อผิดพลาด',
                icon: 'error',
                html: 'กรุณาตรวจสอบประเภทไฟล์ที่ท่านอัพโหลดอีกครั้ง'
            })
        })
    }

    useEffect(() => {
        getCourseForTeacher()
    }, []);

    return (
        <MainLayout>
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
                        <th>สถานะการส่งลำดับขั้น</th>
                        <th>แก้ไขอักษร<br />ลำดับขั้นแล้ว (ราย)</th>
                        <th>การดำเนินการ</th>
                    </tr>
                </thead>
                <tbody className='tableBody'>
                    {courseList.map((course, index) => {
                        const rowNumber = index + 1
                        const studntAmountTextColor = course.isAllfilled ? 'text-success' : ''
                        const submitStatusText = allSubmitStatusTitle[course.submit_status]
                        return (
                            <tr key={course.class_id} >
                                <td className='text-center'>{rowNumber}</td>
                                <td className='text-center'>{course.courseno}</td>
                                <td className='text-center'>{course.seclec}</td>
                                <td className='text-center'>{course.seclab}</td>
                                <td>{course.course_title}</td>
                                <td className='text-center'>{course.courseTermTitle}</td>
                                <td className='text-center'>{submitStatusText}</td>
                                <td className={'text-center ' + studntAmountTextColor}>{course.filled_student + "/" + course.all_student}</td>
                                <td>
                                    <ButtonGroup>
                                        {course.submit_status >= 2
                                            ?
                                            <Button className='action-button-group' variant='outline-primary' onClick={() => onClickFillMenu(course.class_id)}> <Icon.CardList />  ดูข้อมูล</Button>
                                            :
                                            <>
                                                <Button className='action-button-group' variant='outline-primary' onClick={() => onClickFillMenu(course.class_id)}> <Icon.KeyboardFill /> กรอกลำดับขั้น</Button>
                                                <Button variant='outline-secondary' onClick={() => onClickDownload(course.class_id)}><Icon.FileEarmarkArrowDown /> Download Excel</Button>
                                                <FileUploaderButton uploadId={course.class_id} handleFileFunction={onFileUploaded} variant='outline-success'><Icon.FileEarmarkArrowUpFill /> Upload Excel</FileUploaderButton>
                                            </>
                                        }
                                        <Button variant='outline-primary' onClick={() => onClickCMR(course.class_id)}><Icon.FileEarmarkRuled /> CMR 54</Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table> : <h4 className='my-5 text-center'>Loading........</h4>}
        </MainLayout>
    )
}

export default ListCourse