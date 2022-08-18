import axios from 'axios';
import React, { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout'

const ListCourse = () => {
    const [courseList, setCourseList] = useState([]);

    const getCourseForTeacher = async () => {
        const appApiHost = import.meta.env.VITE_API_HOST
        let result
        console.log(`${appApiHost}/courses`)
        await axios
            .get(`${appApiHost}/courses`, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('userToken') } })
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
            {courseList.map(course => (
                <h1 key={course.class_id}>{course.courseno}</h1>
            ))}
            <h1>ทำตารางงงงงงงงงงงงงงงงงงงงงงงงงงง</h1>
            <h1>ถาม itsc ว่า orgid ใน header 000 ได้ไหม ทำไมไม่มา</h1>
        </MainLayout>
    )
}

export default ListCourse