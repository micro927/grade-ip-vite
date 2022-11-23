import './index.scss'
import { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../../layouts/MainLayout'
import TeacherCourseTable from '../../components/TeacherCourseTable';

const ListCourse = () => {
    const [courseList, setCourseList] = useState([]);
    const [courseYearlyList, setCourseYearlyList] = useState([]);
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
                const courseListEdited = await result.map((course) => {
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

                setCourseList(() => {
                    return courseListEdited.filter(course => course.yearly == false)
                })

                setCourseYearlyList(() => {
                    return courseListEdited.filter(course => course.yearly == true)
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

    useEffect(() => {
        getCourseForTeacher()
    }, []);
    return (
        <MainLayout>
            <h2>บันทึกลำดับขั้นแก้ไขอักษร {gradeTypeTitle}</h2>
            {courseList.length + courseYearlyList.length > 0 ?
                <>
                    {courseList.length
                        ? <TeacherCourseTable courseList={courseList} />
                        : ''}

                    {courseYearlyList.length
                        ?
                        <>
                            <hr />
                            <h3>กระบวนวิชารายปี</h3>
                            <TeacherCourseTable courseList={courseYearlyList} />
                        </>
                        : ''}
                </>
                : <h4 className='my-5 text-center'>Loading........</h4>
            }
        </MainLayout>
    )
}

export default ListCourse