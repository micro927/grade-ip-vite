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
                {studentGradeList.map((student, index) => {
                    //////
                    return (
                        <h1 key={index}>{student.name}</h1>
                    )
                })
                }
            </div>
        </MainLayout>
    )
}

export default FillGrade